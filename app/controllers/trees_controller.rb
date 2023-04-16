# frozen_string_literal: true

class TreesController < ApplicationController
  def edit
    @tree = Tree.find(params[:id])
  end
end
