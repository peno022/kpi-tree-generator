# frozen_string_literal: true

class HomeController < ApplicationController
  skip_before_action :check_logged_in, only: :index

  def index
    if current_user
      @trees = current_user.trees.order_by_latest_updated_at.page(params[:page]).per(10)
      render template: 'trees/index'
    else
      render template: 'welcome/index'
    end
  end
end
