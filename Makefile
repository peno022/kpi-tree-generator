.DEFAULT_GOAL := help
DOCKER_IMAGE_NAME := ktg


.PHONY: install
install:
	yarn install
	bundle install

.PHONY: build
build:
	docker build \
		-t $(DOCKER_IMAGE_NAME):latest \
		-f ./Dockerfile \
		--build-arg RAILS_ENV="" \
		--build-arg BUNDLE_WITHOUT="" \
		--build-arg BUNDLE_DEPLOYMENT="" \
		--build-arg FROZEN_LOCKFILE="" \
		--build-arg NO_DOCUMENT="" \
		--build-arg ENVIRONMENT="development" \
		.

.PHONY: push
push:
	gcloud auth configure-docker asia-northeast1-docker.pkg.dev
	docker push asia-northeast1-docker.pkg.dev/kpi-tree-generator/ktg/ktg

.PHONY: pause-db
pause-db:
	gcloud sql instances patch ktg --activation-policy NEVER

.PHONY: resume-db
resume-db:
	gcloud sql instances patch ktg --activation-policy ALWAYS

.PHONY: build-assets
build-assets:
	docker compose -f ./compose.yaml exec app /bin/bash -c 'cd /app && npm run build'

.PHONY: up
up:
	docker compose -f ./compose.yaml up -d

.PHONY: down
down:
	docker compose -f ./compose.yaml down --remove-orphans

.PHONY: reset
reset: down up

.PHONY: log
log:
	docker compose -f ./compose.yaml logs -f || true

.PHONY: login
login:
	docker compose -f ./compose.yaml exec -u root app /bin/bash

.PHONY: download-gcloud-credential
download-gcloud-credential:
	gcloud iam service-accounts keys create litestream-credential.json \
		--iam-account litestream@kpi-tree-generator.iam.gserviceaccount.com

.PHONY: help
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  install: Install dependencies"
	@echo "  build: Build docker image"
	@echo "  up: Start docker container"
	@echo "  down: Stop docker container"
	@echo "  log: Show docker container log"
	@echo "  login: Login docker container"
	@echo "  help: Show this help message"
