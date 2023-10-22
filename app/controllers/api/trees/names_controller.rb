# frozen_string_literal: true

module API
  module Trees
    class NamesController < API::BaseController
      before_action :set_tree
      before_action :ensure_tree_belongs_to_current_user

      def update
        if @tree.update(name: params[:name])
          render json: { name: @tree.reload.name }, status: :ok
        else
          render json: { errors: @tree.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_tree
        @tree = Tree.find(params[:tree_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Not Found' }, status: :not_found and return
      end

      def ensure_tree_belongs_to_current_user
        render json: { error: 'Not Found' }, status: :not_found and return unless @tree.user_id == current_user.id
      end
    end
  end
end
