# frozen_string_literal: true

module Api
  class TreesController < BaseController
    def show
      @tree = Tree.find(params[:id])
      @nodes = @tree.nodes
      @layers = @tree.layers
    end
  end
end
