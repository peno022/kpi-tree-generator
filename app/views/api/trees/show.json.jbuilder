# frozen_string_literal: true

json.tree do
  json.id @tree.id
  json.name @tree.name
end

json.nodes @nodes do |node|
  json.id node.id
  json.name node.name
  json.value node.value
  json.value_format node.value_format
  json.unit node.unit
  json.is_value_locked node.is_value_locked
  json.tree_id node.tree_id
  json.parent_id node.parent_id
end

json.layers @layers do |layer|
  json.id layer.id
  json.operation layer.operation
  json.fraction layer.fraction
  json.parent_node_id layer.parent_node_id
  json.tree_id layer.tree_id
end
