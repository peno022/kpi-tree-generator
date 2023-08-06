# frozen_string_literal: true

class WelcomeController < ApplicationController
  skip_before_action :check_logged_in
  def terms_of_use; end
  def privacy_policy; end
end
