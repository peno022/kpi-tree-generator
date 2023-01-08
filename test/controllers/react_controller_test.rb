require "test_helper"

class ReactControllerTest < ActionDispatch::IntegrationTest
  test "should get hello" do
    get react_hello_url
    assert_response :success
  end
end
