# frozen_string_literal: true

class HomeController < ApplicationController
  skip_before_action :check_logged_in, only: :index

  def index
    if current_user
      render template: 'trees/index'
    else
      render template: 'welcome/index'
    end
  end
end
