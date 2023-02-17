FROM ruby:3.1.3
SHELL ["/bin/bash", "-c"]

# Install Rails
RUN gem install rails webdrivers

# Default value to allow debug server to serve content over GitHub Codespace's port forwarding service
# The value is a comma-separated list of allowed domains
ENV RAILS_DEVELOPMENT_HOSTS=".githubpreview.dev,.preview.app.github.dev,.app.github.dev"

# Install Node.js
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
  && source ~/.bashrc \
  && nvm install 19.4 \
  && nvm use 19.4

# Install yarn
RUN apt update && apt remove cmdtest
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" |  tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get -y install yarn

# Install PostgreSQL
RUN apt-get update
RUN apt-get -y install curl gnupg2 ca-certificates
RUN curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN echo "deb http://apt.postgresql.org/pub/repos/apt bullseye-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list
RUN apt-get update
RUN apt-get -y install postgresql-15
RUN apt-get -y install postgresql-client

# Install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install
