# FROM ruby:3.1.3
# SHELL ["/bin/bash", "-c"]

# ENV RAILS_ENV development

# WORKDIR /app
# # # Copy the main application.
# COPY . ./

# # Install Rails
# RUN gem update --system
# RUN gem install rails webdrivers
# RUN gem install rails -v 7.0.4 --no-document
# 
# RUN gem install bundler -v 2.3.7 --no-document
# # Default value to allow debug server to serve content over GitHub Codespace's port forwarding service
# # The value is a comma-separated list of allowed domains
# ENV RAILS_DEVELOPMENT_HOSTS=".githubpreview.dev,.preview.app.github.dev,.app.github.dev"

# # Install Node.js and Yarn
# RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
#   && source ~/.bashrc \
#   && nvm install 19.4 \
#   && nvm use 19.4 \
#   && corepack enable \
#   && corepack prepare yarn@stable --activate \
#   && yarn set version 3.4.1

# # Install PostgreSQL
# RUN apt-get update
# RUN apt-get -y install curl gnupg2 ca-certificates
# RUN curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
# RUN echo "deb http://apt.postgresql.org/pub/repos/apt bullseye-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list
# RUN apt-get update
# RUN apt-get -y install postgresql-15
# RUN apt-get -y install postgresql-client

# # Install gems
# COPY Gemfile Gemfile.lock ./
# RUN bundle install

# ENV PORT 3000
# EXPOSE 3000

# CMD bin/rails server -p $PORT -e $RAILS_ENV


# #################
# FROM ruby:3.1.3
# SHELL ["/bin/bash", "-c"]


# # ページ開けない
# # ENV RAILS_ENV development

# # ページ開けるけどassetsよめない
# # ENV RAILS_ENV production

# ENV RAILS_SERVE_STATIC_FILES true


# WORKDIR /app

# # Copy the main application.
# COPY . ./

# # Install Rails
# RUN gem update --system
# RUN gem install rails -v 7.0.4 --no-document

# RUN gem install bundler -v 2.3.7 --no-document
# RUN bundle config set without development:test

# # Install Node.js and Yarn and packages
# RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
#   && source ~/.bashrc \
#   && nvm install 19.4 \
#   && nvm use 19.4 \
#   && corepack enable \
#   && corepack prepare yarn@stable --activate \
#   && yarn set version 3.4.1 \
#   # && cp package.json yarn.lock ./ \
#   && yarn plugin import workspace-tools \
#   && yarn workspaces focus --production \
#   && bundle install \
#   && bin/rails css:build \
#   && bin/rails javascript:build
#   # && /app/bin/rails css:build \
#   # && /app/bin/rails javascript:build

# # # Install gems
# # COPY Gemfile Gemfile.lock ./
# # RUN bundle install

# # # build assets
# # RUN bin/rails css:build
# # RUN bin/rails javascript:build

# COPY . ./

# ENV PORT 3000
# EXPOSE 3000

# CMD bin/rails server -p $PORT -e $RAILS_ENV









#################
FROM ruby:3.1.3
SHELL ["/bin/bash", "-c"]

ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true

WORKDIR /app

# Copy the main application.
COPY . ./

# Install Rails
RUN gem update --system
RUN gem install rails -v 7.0.4 --no-document

RUN gem install bundler -v 2.3.7 --no-document
RUN bundle config set without development:test

# Install Node.js and Yarn and packages
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
  && source ~/.bashrc \
  && nvm install 19.4 \
  && nvm use 19.4 \
  && corepack enable \
  && corepack prepare yarn@stable --activate \
  && yarn set version 3.4.1 \
  # && cp package.json yarn.lock ./ \
  && yarn plugin import workspace-tools \
  && yarn workspaces focus --production \
  && bundle install \
  && bin/rails css:build \
  && bin/rails javascript:build \
  && bin/rails assets:precompile

# # Install gems
# COPY Gemfile Gemfile.lock ./
# RUN bundle install

# いる？
COPY . ./

ENV PORT 3000
EXPOSE 3000
CMD bin/rails server -p $PORT -e $RAILS_ENV
