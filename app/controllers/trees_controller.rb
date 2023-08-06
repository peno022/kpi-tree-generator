# frozen_string_literal: true

class TreesController < ApplicationController
  def edit
    tree = Tree.find(params[:id])
    if tree.user_id == current_user.id
      @tree = tree
    else
      render file: Rails.public_path.join('404.html'), status: :not_found, layout: false, content_type: 'text/html'
    end
  end
end
