# frozen_string_literal: true

module API
  class BaseController < ApplicationController
    include SessionsHelper
    before_action :check_logged_in

    def check_logged_in
      return if current_user

      render json: { errors: [I18n.t('alert.require_login')] }, status: :unauthorized
    end
  end
end
