data "google_project" "project" {}

# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket
resource "google_storage_bucket" "ktg-static" {
  name          = "ktg-static"
  location      = "ASIA-NORTHEAST1" # https://cloud.google.com/storage/docs/locations?hl=ja
  force_destroy = false
}

resource "google_storage_bucket_access_control" "public_rule" {
  depends_on = [google_storage_bucket.ktg-static]
  bucket     = google_storage_bucket.ktg-static.name
  role       = "READER"
  entity     = "allUsers"
}

# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_project_iam#google_project_iam_member
resource "google_project_iam_member" "deploy" {
  for_each = toset([local.service_accounts.compute, local.service_accounts.cloudbuild])
  project  = "kpi-tree-generator"
  # https://cloud.google.com/ruby/rails/run?hl=ja#store_secret_values_in
  # https://cloud.google.com/secret-manager/docs/access-control?hl=ja
  role   = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${each.value}"
}

# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_project_iam#google_project_iam_member
resource "google_project_iam_member" "cloudbuild_sql_access" {
  project = "kpi-tree-generator"
  # https://cloud.google.com/ruby/rails/run?hl=ja#grant_access_to
  # https://cloud.google.com/sql/docs/mysql/iam-roles?hl=ja#roles
  role   = "roles/cloudsql.client"
  member = "serviceAccount:${local.service_accounts.cloudbuild}"
}

resource "google_artifact_registry_repository" "this" {
  location      = "asia-northeast1"
  repository_id = "ktg"
  format        = "DOCKER"
}

resource "google_secret_manager_secret" "this" {
  for_each  = local.secrets
  secret_id = each.value.id
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "this" {
  for_each    = local.secrets
  secret      = google_secret_manager_secret.this[each.key].id
  secret_data = each.value.value
}

# resource "google_service_account" "cloudrun" {
#   account_id = "cloudrun-sa"
# }

# https://cloud.google.com/build/docs/automating-builds/github/connect-repo-github?hl=ja
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloudbuildv2_repository
resource "google_cloudbuildv2_repository" "this" {
  name              = "ktg"
  parent_connection = "projects/kpi-tree-generator/locations/asia-northeast1/connections/ktg"
  remote_uri        = "https://github.com/peno022/kpi-tree-generator.git"
}

# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloudbuild_trigger
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloudbuild_trigger#example-usage---cloudbuild-trigger-include-build-logs
resource "google_cloudbuild_trigger" "ktg_main_push" {
  location = "global"
  name     = "ktg-main-push"
  project  = "kpi-tree-generator"
  filename = "cloudbuild.yaml"
  github {
    name  = "kpi-tree-generator"
    owner = "peno022"
    push {
      branch = "^prepare-gcp-deploy$"
      # TODO: 動作確認できたらmainに戻す 
      # branch = "^main$"
    }
  }
}

# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/sql_database_instance
resource "google_sql_database_instance" "this" {
  database_version    = "POSTGRES_15"
  deletion_protection = true
  instance_type       = "CLOUD_SQL_INSTANCE"
  maintenance_version = "POSTGRES_15_2.R20230530.01_11"
  name                = "ktg"
  project             = "kpi-tree-generator"
  region              = "asia-northeast1"
  settings {
    activation_policy           = "ALWAYS"
    availability_type           = "ZONAL"
    connector_enforcement       = "NOT_REQUIRED"
    deletion_protection_enabled = true
    disk_autoresize             = true
    disk_autoresize_limit       = 100
    disk_size                   = 10
    disk_type                   = "PD_SSD"
    edition                     = "ENTERPRISE"
    pricing_plan                = "PER_USE"
    tier                        = "db-f1-micro"
  }
}

# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/sql_database
resource "google_sql_database" "this" {
  depends_on = [google_sql_database_instance.this]
  name       = "ktg"
  instance   = google_sql_database_instance.this.name
}

resource "google_sql_user" "this" {
  depends_on = [google_sql_database_instance.this]
  name       = "ktg-production"
  instance   = google_sql_database_instance.this.name
  password   = var.db_password
}

# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_v2_service
resource "google_cloud_run_v2_service" "this" {
  client         = "gcloud"
  client_version = "446.0.1"
  ingress        = "INGRESS_TRAFFIC_ALL"
  location       = "asia-northeast1"
  name           = "ktg"
  project        = "kpi-tree-generator"
  template {
    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.this.connection_name]
      }
    }
    max_instance_request_concurrency = 80
    service_account                  = local.service_accounts.compute
    timeout                          = "300s"
    containers {
      image = "asia-northeast1-docker.pkg.dev/kpi-tree-generator/ktg/ktg"
      ports {
        container_port = 8080
        name           = "http1"
      }
      resources {
        cpu_idle = true
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
        startup_cpu_boost = true
      }

      dynamic "env" {
        for_each = local.secrets
        content {
          name = split("__", env.value.id)[1]
          value_source {
            secret_key_ref {
              version = "latest"
              secret  = env.value.id
            }
          }
        }
      }
      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }
    }
    scaling {
      max_instance_count = 2
      min_instance_count = 0
    }
  }
}

# https://cloud.google.com/run/docs/mapping-custom-domains?hl=ja#map
resource "google_cloud_run_domain_mapping" "this" {
  name     = "kpi-tree.com"
  location = google_cloud_run_v2_service.this.location
  metadata {
    namespace = data.google_project.project.project_id
  }
  spec {
    route_name = google_cloud_run_v2_service.this.name
  }
}
