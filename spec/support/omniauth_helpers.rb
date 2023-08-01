# frozen_string_literal: true

module OmniAuthHelpers
  def self.set_omniauth(service = :google_oauth2)
    OmniAuth.config.test_mode = true

    auth_hash = {
      provider: service.to_s,
      uid: '1234',
      info: {
        name: 'mockuser',
        email: 'test.mail@example.com',
        image: 'https://test.com/test.png'
      }
    }
    OmniAuth.config.mock_auth[service] = OmniAuth::AuthHash.new(auth_hash)
  end
end
