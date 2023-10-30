# frozen_string_literal: true

module API
  module Trees
    class NamesController < Trees::BaseController
      def update
        if @tree.update(name: params[:name])
          render json: { name: @tree.reload.name }, status: :ok
        else
          render json: { errors: @tree.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end
