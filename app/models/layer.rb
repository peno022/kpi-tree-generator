# frozen_string_literal: true

class NodesCountValidator < ActiveModel::Validator
  def validate(layer)
    return true if layer.nodes.blank? || layer.nodes.length >= 2

    layer.errors.add :nodes_count, 'must have 0 or 2 or more nodes'
  end
end

class NodesParentValidator < ActiveModel::Validator
  def validate(layer)
    layer.errors.add :nodes_parent, 'all nodes in a Layer must have the same parent' unless same_parent?(layer.nodes)
  end

  private

  def same_parent?(nodes)
    return true if nodes.length < 2

    parent_id = nodes.first['parent_id']
    return false if parent_id.nil?

    nodes.all? { |node| node['parent_id'] == parent_id }
  end
end

class Layer < ApplicationRecord
  enum :operation, { 'かけ算': 0, 'たし算': 1 }
  has_many :nodes, class_name: 'Node', dependent: :destroy
  validates :fraction, numericality: true, allow_nil: true
  validates_with NodesCountValidator
  validates_with NodesParentValidator
end
