# frozen_string_literal: true

# Capybara.register_driver :chrome_headless do |app|
#   options = ::Selenium::WebDriver::Chrome::Options.new

#   # options.add_argument('--headless')
#   options.add_argument('--no-sandbox')
#   options.add_argument('--disable-dev-shm-usage')
#   # options.add_argument('--window-size=1400,1400')

#   Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
# end

# Capybara.javascript_driver = :chrome_headless


RSpec.configure do |config|
  config.before(:each, type: :system) do
    driven_by :rack_test
  end

  # config.before(:each, js: true, type: :system) do
  #   driven_by :selenium_chrome_headless
  # end
  # config.before(:each, js: true, type: :system) do
  #   driven_by :chrome_headless
  # end

  # https://qiita.com/suketa/items/d783ac61c2a3e4c16ad4#docker-composeyml-%E3%81%AE%E7%B7%A8%E9%9B%86
  # config.before(:each, js: true, type: :system) do
  #   driven_by :selenium, using: :chrome, options: {
  #     browser: :remote,
  #     url: ENV.fetch('SELENIUM_DRIVER_URL'),
  #     desired_capabilities: :chrome
  #   }
  #   Capybara.server_host = 'app'
  #   Capybara.app_host='http://app'
  # end

  config.before(:each, js: true, type: :system) do
    driven_by :selenium, using: :headless_chrome, options: {
      browser: :remote,
      url: ENV.fetch('SELENIUM_DRIVER_URL'),
    }
    Capybara.server_host = 'app'
  end
end
