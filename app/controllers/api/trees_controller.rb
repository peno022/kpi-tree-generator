# frozen_string_literal: true

module API
  class TreesController < Trees::BaseController
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

    private

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
  end
end
