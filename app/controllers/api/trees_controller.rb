# frozen_string_literal: true

module Api
  class TreesController < BaseController
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
  end
end
