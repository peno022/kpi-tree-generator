# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket
resource "google_storage_bucket" "this" {
  name          = "ktg-litestream"
  location      = "ASIA-NORTHEAST1" # https://cloud.google.com/storage/docs/locations?hl=ja
  force_destroy = false

  public_access_prevention = "enforced"
}

// https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_service_account
resource "google_service_account" "litestream" {
  account_id   = "litestream"
  display_name = "litestream"
}

// https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_project_iam#google_project_iam_member
resource "google_project_iam_member" "litestream" {
  project = "kpi-tree-generator"
  // https://litestream.io/guides/gcs/#create-a-service-account
  // https://cloud.google.com/storage/docs/access-control/iam-roles?hl=ja
  role   = "roles/storage.admin"
  member = "serviceAccount:${google_service_account.litestream.email}"
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
#       // branch       = "^main$"
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
  database_version     = "POSTGRES_15"
  deletion_protection  = true
  instance_type        = "CLOUD_SQL_INSTANCE"
  maintenance_version  = "POSTGRES_15_2.R20230530.01_11"
  name                 = "ktg"
  project              = "kpi-tree-generator"
  region               = "asia-northeast1"
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
  name     = "ktg"
  instance = google_sql_database_instance.this.name
}

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
