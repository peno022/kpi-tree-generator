terraform {
  required_version = "~> 1.5.0"

  backend "gcs" {
    bucket = "ktg-tf-state"
    prefix = "terraform/main"
  }

  # https://registry.terraform.io/providers/hashicorp/google/latest/docs
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = "kpi-tree-generator"
  region  = "asia-northeast1"
}
