# frozen_string_literal: true

module Api
  class TreesController < BaseController
    before_action :set_tree, only: %i[show update]

    def show
      @nodes = @tree.nodes
      @layers = @tree.layers
    end

    def update
      tree_params[:nodes].map do |node|
        @tree.nodes.find(node[:id]).assign_attributes(node)
      end
      tree_params[:layers].map do |layer|
        @tree.layers.find(layer[:id]).assign_attributes(layer)
      end
      @tree.save!
      render json: { tree: @tree, nodes: @tree.nodes, layers: @tree.layers }
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
  end
end
