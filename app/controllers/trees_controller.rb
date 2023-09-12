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

  def create_and_edit
    @tree = Tree.new(name: '新しいツリー', user_id: current_user.id)

    begin
      ActiveRecord::Base.transaction do
        @tree.save!
        @tree.create_default_structure
      end
      redirect_to edit_tree_path(@tree)
    rescue ActiveRecord::RecordInvalid
      flash[:alert] = I18n.t('custom_errors.messages.tree_create_failed')
      redirect_to root_path
    end
  end
end
