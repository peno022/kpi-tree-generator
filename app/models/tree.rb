# frozen_string_literal: true

class Tree < ApplicationRecord
  belongs_to :user
  has_many :nodes, dependent: :destroy
  has_many :layers, dependent: :destroy
  validates :name, presence: true

  def update_tree_with_params(tree_params)
    ActiveRecord::Base.transaction do
      nodes, layers, initial_nodes_to_delete = process_params(tree_params)
      (nodes + layers).each(&:save!)
      initial_nodes_to_delete.each(&:destroy!)
      prune_isolated_layers
    end
  end

  def create_default_structure
    return if nodes.any?

    ActiveRecord::Base.transaction do
      parent_node = Node.create!(
        name: '親の要素', value: 100, unit: '円', value_format: '万', is_value_locked: false, tree_id: id
      )
      Node.create!(name: '子の要素1', value: 1000, unit: '円', value_format: '万', is_value_locked: false,
                   parent: parent_node, tree_id: id)
      Node.create!(name: '子の要素2', value: 10, unit: '', value_format: '%', is_value_locked: false,
                   parent: parent_node, tree_id: id)
      Layer.create!(operation: 'multiply', fraction: 0, parent_node:, tree_id: id)
    end
  end

  private

  def process_params(tree_params)
    nodes = assign_nodes_attributes(tree_params[:nodes])
    layers = assign_layers_attributes(tree_params[:layers])
    initial_nodes_to_delete = extract_initial_nodes_to_delete(tree_params[:nodes])
    exclude_objects_to_be_deleted(initial_nodes_to_delete, nodes, layers)
    [nodes, layers, initial_nodes_to_delete]
  end

  def assign_nodes_attributes(node_params)
    node_params.map do |node_param|
      node = if node_param[:id]
               nodes.find(node_param[:id])
             else
               Node.new(tree_id: id)
             end
      node.assign_attributes(node_param.slice(:name, :value, :value_format, :unit, :is_value_locked, :parent_id))
      node
    end
  end

  def assign_layers_attributes(layer_params)
    layer_params.map do |layer_param|
      layer = if layer_param[:id]
                layers.find(layer_param[:id])
              else
                Layer.new(tree_id: id)
              end
      layer.operation = layer_param[:operation]
      layer.fraction = layer_param[:fraction] || 0
      layer.parent_node_id = layer_param[:parent_node_id]
      layer
    end
  end

  def exclude_objects_to_be_deleted(initial_nodes_to_delete, nodes, layers)
    nodes_to_delete = initial_nodes_to_delete + gather_descendants(initial_nodes_to_delete)
    layers_to_delete = layers.select { |layer| nodes_to_delete.map(&:id).include?(layer.parent_node_id) }

    nodes.reject! { |node| nodes_to_delete.include?(node) }
    layers.reject! { |layer| layers_to_delete.include?(layer) }
  end

  def extract_initial_nodes_to_delete(node_params)
    node_ids_in_params = node_params.pluck(:id).compact
    nodes.where.not(id: node_ids_in_params).where.not(id: nil)
  end

  def gather_descendants(nodes)
    nodes.flat_map { |node| node.children + gather_descendants(node.children) }
  end

  def prune_isolated_layers
    layers_parent_node_ids = layers.map(&:parent_node_id).uniq.compact
    nodes_parent_ids = nodes.map(&:parent_id).uniq.compact
    layers.where(parent_node_id: layers_parent_node_ids - nodes_parent_ids).destroy_all
  end
end
