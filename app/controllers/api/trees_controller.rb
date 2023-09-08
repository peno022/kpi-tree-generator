# frozen_string_literal: true

module Api
  class TreesController < BaseController
    before_action :set_tree
    before_action :ensure_tree_belongs_to_current_user

    def show
      @nodes = @tree.nodes.order(:id)
      @layers = @tree.layers.order(:id)
    end

    def update
      @tree.update_tree_with_params(tree_params)
      reload_tree
      render json: {
        tree: @tree.as_json(except: %i[created_at updated_at]),
        nodes: @tree.nodes.order(:id).as_json(except: %i[created_at updated_at]),
        layers: @tree.layers.order(:id).as_json(except: %i[created_at updated_at])
      }, status: :ok
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages, record: e.record }, status: :unprocessable_entity
    end

    def update_name
      Rails.logger.info "Updating tree name to #{params[:name]}"
      if @tree.update(name: params[:name])
        render json: { name: @tree.reload.name }, status: :ok
      else
        render json: { errors: @tree.errors.full_messages.join(', ') }, status: :unprocessable_entity
      end
    end

    private

    def set_tree
      @tree = Tree.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Not Found' }, status: :not_found and return
    end

    def tree_params
      params.require(:tree).permit(
        nodes: %i[id name value value_format unit is_value_locked parent_id tree_id],
        layers: %i[id operation parent_node_id fraction tree_id]
      )
    end

    def reload_tree
      @tree.nodes.reload
      @tree.layers.reload
    end

    def ensure_tree_belongs_to_current_user
      render json: { error: 'Not Found' }, status: :not_found and return unless @tree.user_id == current_user.id
    end
  end
end
