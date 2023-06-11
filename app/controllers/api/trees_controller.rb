# frozen_string_literal: true

module Api
  class TreesController < BaseController
    before_action :set_tree, only: %i[show update]

    def show
      @nodes = @tree.nodes
      @layers = @tree.layers
    end

    def update
      update_nodes
      update_layers
      ActiveRecord::Base.transaction do
        (@nodes + @layers).each(&:save!)
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

    def update_nodes
      @nodes = tree_params[:nodes].map do |node_param|
        node = @tree.nodes.find(node_param[:id])
        node.assign_attributes(node_param.slice(:name, :value, :value_format, :unit, :is_value_locked))
        node
      end
    end

    def update_layers
      @layers = tree_params[:layers].map do |layer_param|
        layer = @tree.layers.find(layer_param[:id])
        layer.operation = layer_param[:operation]
        layer.fraction = layer_param[:fraction] || 0
        layer
      end
    end
  end
end
