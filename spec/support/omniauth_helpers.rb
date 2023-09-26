# frozen_string_literal: true

RSpec.configure do
  OmniAuth.config.test_mode = true
  auth_hash = {
    provider: 'google_oauth2',
    uid: '1234',
    info: {
      name: 'mockuser',
      email: 'test.mail@example.com'
    }
  }
  OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new(auth_hash)
end
