# frozen_string_literal: true

Rails.application.config.middleware.use OmniAuth::Builder do
  if Rails.application.credentials.dig(:google, :client_id)
    provider :google_oauth2,
             Rails.application.credentials.google[:client_id],
             Rails.application.credentials.google[:client_secret]
  end
end
