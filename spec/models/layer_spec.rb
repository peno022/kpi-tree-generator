# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Layer do
  it 'parent_node_idに存在しないIDを指定すると無効になる' do
    layer = described_class.new(parent_node_id: Node.maximum(:id).to_i + 1)
    layer.valid?
    expect(layer.errors[:parent_node]).to include('must exist')
  end

  it '存在しないtree_idを指定すると無効になる' do
    layer = described_class.new(tree_id: Tree.maximum(:id).to_i + 1)
    layer.valid?
    expect(layer.errors[:tree]).to include('must exist')
  end

  it 'operationにenum定義外の数値を入れるとArgumentErrorになる' do
    expect do
      described_class.new(operation: 999)
    end.to raise_error(ArgumentError)
  end
end
