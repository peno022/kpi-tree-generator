locals {
  service_accounts = {
    compute    = "254382313641-compute@developer.gserviceaccount.com"
    cloudbuild = "254382313641@cloudbuild.gserviceaccount.com"
  }
  secrets = {
    google_project_id = {
      id    = "ktg__GOOGLE_PROJECT_ID"
      value = "kpi-tree-generator"
    }
    production_db_name = {
      id    = "ktg__PRODUCTION_DB_NAME"
      value = "ktg"
    }
    production_db_username = {
      id    = "ktg__PRODUCTION_DB_USERNAME"
      value = "ktg-production"
    }
    rails_master_key = {
      id    = "ktg__RAILS_MASTER_KEY"
      value = var.rails_master_key
    }
    storage_bucket_name = {
      id    = "ktg__STORAGE_BUCKET_NAME"
      value = "ktg-static"
    }

    cloud_sql_connection_name = {
      id    = "ktg__CLOUD_SQL_CONNECTION_NAME"
      value = "kpi-tree-generator:asia-northeast1:ktg"
    }
  }
}
