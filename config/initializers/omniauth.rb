# frozen_string_literal: true

Rails.application.config.middleware.use OmniAuth::Builder do
  if Rails.env.test?
    provider :google_oauth2,
             ENV.fetch('GOOGLE_CLIENT_ID', nil),
             ENV.fetch('GOOGLE_CLIENT_SECRET', nil)
  else
    provider :google_oauth2,
             Rails.application.credentials.google[:client_id],
             Rails.application.credentials.google[:client_secret]
  end
end
