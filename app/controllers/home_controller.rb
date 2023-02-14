# frozen_string_literal: true

class HomeController < ApplicationController
  def index
    # TODO: ログイン機能を実装後
    # if current_user render home/index else render welcome/index にしたい
    render template: 'welcome/index'
  end
end
