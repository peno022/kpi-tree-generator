# frozen_string_literal: true

module Api
  class TreesController < BaseController
    before_action :set_tree, only: %i[show update]

    def show
      tree = Tree.find(params[:id])
      if tree.user_id == current_user.id
        @tree = tree
        @nodes = @tree.nodes
        @layers = @tree.layers
      else
        render status: :not_found
      end
    end

    def update
      assign_nodes_attributes
      assign_layers_attributes
      begin
        ActiveRecord::Base.transaction do
          (@nodes + @layers).each(&:save!)
          delete_nodes_not_in_params
        end
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages, record: e.record }, status: :unprocessable_entity
      end
    end

    private

    def set_tree
      @tree = Tree.find(params[:id])
    end

    def tree_params
      params.require(:tree).permit(
        nodes: %i[id name value value_format unit is_value_locked parent_id tree_id],
        layers: %i[id operation parent_node_id fraction tree_id]
      )
    end

    def assign_nodes_attributes
      @nodes = tree_params[:nodes].map do |node_param|
        node = if node_param[:id]
                 @tree.nodes.find(node_param[:id])
               else
                 Node.new(tree_id: @tree.id)
               end
        node.assign_attributes(node_param.slice(:name, :value, :value_format, :unit, :is_value_locked, :parent_id))
        node
      end
    end

    def assign_layers_attributes
      @layers = tree_params[:layers].map do |layer_param|
        layer = if layer_param[:id]
                  @tree.layers.find(layer_param[:id])
                else
                  Layer.new(tree_id: @tree.id)
                end
        layer.operation = layer_param[:operation]
        layer.fraction = layer_param[:fraction] || 0
        layer.parent_node_id = layer_param[:parent_node_id]
        layer
      end
    end

    def delete_nodes_not_in_params
      node_ids_in_params = tree_params[:nodes].pluck(:id).compact
      nodes_to_delete = @tree.nodes.where.not(id: node_ids_in_params)
      nodes_to_delete.destroy_all
    end
  end
end
