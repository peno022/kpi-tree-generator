# frozen_string_literal: true

class HomeController < ApplicationController
  skip_before_action :check_logged_in, only: :index

  def index
    if current_user
      @trees = current_user.trees.order(updated_at: :desc).page(params[:page]).per(10)
      render template: 'trees/index'
    else
      render template: 'welcome/index'
    end
  end
end
