data "google_project" "project" {}

# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket
resource "google_storage_bucket" "this" {
  name          = "ktg-litestream"
  location      = "ASIA-NORTHEAST1" # https://cloud.google.com/storage/docs/locations?hl=ja
  force_destroy = false

  public_access_prevention = "enforced"
}

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

# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_service_account
resource "google_service_account" "litestream" {
  account_id   = "litestream"
  display_name = "litestream"
}

# # https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_project_iam#google_project_iam_member
# resource "google_project_iam_member" "litestream" {
#   project = "kpi-tree-generator"
#   # https://litestream.io/guides/gcs/#create-a-service-account
#   # https://cloud.google.com/storage/docs/access-control/iam-roles?hl=ja
#   role   = "roles/storage.admin"
#   member = "serviceAccount:${google_service_account.litestream.email}"
# }

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

resource "google_service_account" "cloudrun" {
  account_id = "cloudrun-sa"
}

# # https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloudbuildv2_connection
# resource "google_cloudbuildv2_connection" "this" {
#   location = "asia-northeast1"
#   name = "ktg"

#   github_config {
#     app_installation_id = 40674106
#     authorizer_credential {
#       oauth_token_secret_version = google_secret_manager_secret_version.github-token-secret-version.id
#     }
#   }
# }
# https://cloud.google.com/build/docs/automating-builds/github/connect-repo-github?hl=ja
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloudbuildv2_repository
resource "google_cloudbuildv2_repository" "this" {
  name              = "ktg"
  parent_connection = "projects/kpi-tree-generator/locations/asia-northeast1/connections/ktg"
  remote_uri        = "https://github.com/peno022/kpi-tree-generator.git"
}

# import {
#   # id = "projects/kpi-tree-generator/locations/asia-northeast1/triggers/73f56e66-d58f-4a45-9866-1eb35e080527"
#   id = "tmp"
#   to = google_cloudbuild_trigger.tmp 
# }

resource "google_cloudbuild_trigger" "tmp" {
  location = "global"
  name     = "tmp"
  project  = "kpi-tree-generator"
  filename = "cloudbuild.yaml"
  github {
    name  = "kpi-tree-generator"
    owner = "peno022"
    push {
      branch = "^prepare-gcp-deploy$"
    }
  }
}


# resource "google_cloudbuild_trigger" "merge_main" {
#   filename           = "cloudbuild.yaml"
#   location           = "asia-northeast1"
#   name               = "merge-main"
#   project            = "kpi-tree-generator"
#   github {
#     # repository = google_cloudbuildv2_repository.this.id
#     name  = "kpi-tree-generator"
#     owner = "peno022"
#     push {
#       # branch       = "^main$"
#       branch       = "^prepare-gcp-deploy$"
#     }
#   }
# }


# resource "google_cloudbuild_trigger" "tag_production" {
#   filename           = "cloudbuild.yaml"
#   location           = "asia-northeast1"
#   name               = "tag-production"
#   project            = "kpi-tree-generator"
#   repository_event_config {
#     repository = "projects/kpi-tree-generator/locations/asia-northeast1/connections/ktg/repositories/ktg"
#     push {
#       branch       = null
#       invert_regex = false
#       tag          = "^v.*$"
#     }
#   }
# }

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
resource "google_sql_database" "database" {
  depends_on = [google_sql_database_instance.this]
  name       = "ktg"
  instance   = google_sql_database_instance.this.name
}

resource "google_sql_user" "users" {
  depends_on = [google_sql_database_instance.this]
  name       = "ktg-production"
  instance   = google_sql_database_instance.this.name
  password   = var.db_password
}

import {
  id = "asia-northeast1/ktg"
  to = google_cloud_run_v2_service.this
}

# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_v2_service
resource "google_cloud_run_v2_service" "this" {
  # annotations    = {}
  client         = "gcloud"
  client_version = "446.0.1"
  # description    = null
  ingress = "INGRESS_TRAFFIC_ALL"
  # labels = {
  #   gcb-trigger-id     = "c1c6f62b-e429-4ee3-9fc2-de98dc2c28fd"
  #   gcb-trigger-region = "global"
  #   managed-by         = "gcp-cloud-build-deploy-cloud-run"
  # }
  # launch_stage = "GA"
  location = "asia-northeast1"
  name     = "ktg"
  project  = "kpi-tree-generator"
  template {
    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.this.connection_name]
      }
    }
    # annotations                      = {}
    # encryption_key                   = null
    # execution_environment            = null
    # labels                           = {}
    max_instance_request_concurrency = 80
    # revision                         = "ktg-00003-hab"
    service_account = local.service_accounts.compute
    # session_affinity                 = false
    timeout = "300s"
    containers {
      # args        = []
      # command     = []
      image = "asia-northeast1-docker.pkg.dev/kpi-tree-generator/ktg/ktg"
      # name        = null
      # working_dir = null
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
      #       dynamic "env" {
      #   for_each = {for e in local.envvars : e.name => e.value }
      #   content {
      #     name = env.key
      #     value = env.value
      #   }
      # }

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
      # startup_probe {
      #   failure_threshold     = 1
      #   initial_delay_seconds = 0
      #   period_seconds        = 240
      #   timeout_seconds       = 240
      #   tcp_socket {
      #     port = 8080
      #   }
      # }
    }
    scaling {
      max_instance_count = 2
      min_instance_count = 0
    }
  }
  # lifecycle {
  #   ignore_changes = [ template[0].revision ]
  # }
  # timeouts {
  #   create = null
  #   delete = null
  #   update = null
  # }
  # traffic {
  #   percent  = 100
  #   revision = null
  #   tag      = null
  #   type     = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  # }
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


# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_v2_service
# resource "google_cloud_run_v2_service" "this" {
#   location = "asia-northeast1"
#   name = "ktg"
#   template {
#     service_account = google_service_account.cloudrun.email
#     containers {
#       image = "asia-northeast1-docker.pkg.dev/kpi-tree-generator/ktg/ktg:latest"
#       ports {
#         container_port = 8080
#       }
#       resources {
#         limits {
#           cpu = "1"
#           memory = "512Mi"
#         }
#       }

#       dynamic "env" {
#         for_each = {for e in local.envvars : e.name => e.value }
#         content {
#           name = env.key
#           value = env.value
#         }
#       }

#       dynamic "env" {
#         for_each = {for e in local.secrets : e.name => e.value }
#         content {
#           name = split("__", env.key)[1]
#           value_source {
#             secret_key_ref {
#               version = "latest"
#               secret = env.key
#             }
#           }
#         }
#       }
#     }

#     annotations = {
#       "autoscaling.knative.dev/minScale" = "1"
#       "autoscaling.knative.dev/maxScale" = "2"
#     }
#   }
# }

# resource "google_cloudbuild_trigger" "main_tag_trigger" {
#   provider = google

#   name     = "main-tag-trigger"
#   enabled  = true

#   github {
#     owner = "your-github-username"
#     name  = "your-repo-name"
#     push {
#       tag = "^.*$"
#     }
#   }

#   filename = "cloudbuild.yaml"
# }
