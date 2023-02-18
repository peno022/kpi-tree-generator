# frozen_string_literal: true

RSpec.configure do |config|
  config.before(:each, type: :system) do
    driven_by :rack_test
  end

  config.before(:each, js: true, type: :system) do
    driven_by :selenium, using: :headless_chrome, options: {
      browser: :remote,
      url: ENV.fetch('SELENIUM_DRIVER_URL'),
    }
    Capybara.server_host = 'app'
    Capybara.app_host='http://app'
  end
end
