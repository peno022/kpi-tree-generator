# frozen_string_literal: true

class TreesController < ApplicationController
  before_action :set_tree, only: %i[edit destroy]

  def edit
    @tree
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

  def destroy
    target_tree_name = @tree.name if @tree
    @tree.destroy!
    flash[:notice] = I18n.t('messages.tree_destroyed', target_tree_name:)
    redirect_to root_path
  rescue ActiveRecord::RecordNotDestroyed
    handle_destroy_failure
  end

  private

  def set_tree
    @tree = Tree.find_by(id: params[:id], user_id: current_user.id)
    render file: Rails.root.join('public/404.html').to_s, status: :not_found if @tree.nil?
  end

  def handle_destroy_failure
    flash[:alert] = I18n.t('custom_errors.messages.tree_destroy_failed', target_tree_name:)
    redirect_to root_path
  end
end
