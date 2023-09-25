# syntax = docker/dockerfile:1

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
ARG RUBY_VERSION=3.1.3
FROM ruby:$RUBY_VERSION-slim as base

WORKDIR /rails

RUN addgroup --gid 1000 ktg && \
    adduser --uid 1000 --gid 1000 --disabled-password --gecos "" ktg

USER ktg

# 開発環境の場合 --build-arg で値を上書きする
ARG RAILS_ENV="production"
ARG BUNDLE_WITHOUT="development:test"
ARG BUNDLE_DEPLOYMENT="1"
ARG NO_DOCUMENT="--no-document"

ENV RAILS_ENV=${RAILS_ENV}
ENV BUNDLE_WITHOUT=${BUNDLE_WITHOUT}
ENV BUNDLE_DEPLOYMENT=${BUNDLE_DEPLOYMENT}

# Update gems and bundler
RUN gem update --system ${NO_DOCUMENT} && \
    gem install ${NO_DOCUMENT} bundler

USER root

FROM base as build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential curl libpq-dev node-gyp pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

ARG NODE_VERSION=19.4.0
ARG YARN_VERSION=3.4.1
ARG FROZEN_LOCKFILE="--frozen-lockfile"
ENV PATH=/usr/local/node/bin:$PATH
RUN curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
    /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
    corepack enable && \
    corepack prepare yarn@$YARN_VERSION --activate && \
    rm -rf /tmp/node-build-master

COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    bundle exec bootsnap precompile --gemfile && \
    rm -rf ~/.bundle/ $BUNDLE_PATH/ruby/*/cache $BUNDLE_PATH/ruby/*/bundler/gems/*/.git

COPY package.json yarn.lock ./
RUN yarn install ${FROZEN_LOCKFILE}

COPY . .

RUN bundle exec bootsnap precompile app/ lib/ && \
    SECRET_KEY_BASE=DUMMY ./bin/rails assets:precompile

# Final stage for app image
FROM base
ARG ENVIRONMENT="production"
ARG NODE_VERSION=19.4.0
ARG YARN_VERSION=3.4.1
ENV PATH=/usr/local/node/bin:$PATH

# Install packages needed for deployment and development
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl postgresql-client && \
    if [ "$ENVIRONMENT" = "development" ]; then \
      apt-get install --no-install-recommends -y build-essential libpq-dev node-gyp pkg-config python-is-python3; \
      curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
      /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
      corepack enable && \
      corepack prepare yarn@$YARN_VERSION --activate && \
      rm -rf /tmp/node-build-master; \
    fi && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# Copy built artifacts: gems, application
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails

RUN chown -R ktg:ktg db log storage tmp

USER ktg:ktg

# Deployment options
# ENV RAILS_LOG_TO_STDOUT="1" \
#     RAILS_SERVE_STATIC_FILES="true"
# Set deployment oprtions for production
RUN if [ "$ENVIRONMENT" = "production" ]; then \
      echo 'export RAILS_LOG_TO_STDOUT="1"' >> ~/.bashrc && \
      echo 'export RAILS_SERVE_STATIC_FILES="true"' >> ~/.bashrc; \
    fi

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080
CMD ["./bin/rails", "server"]
