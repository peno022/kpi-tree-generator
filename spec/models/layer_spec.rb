# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Layer do
  describe 'validations' do
    it '持っている全てのノードのparent_idが同じかつnilでなければ有効になる' do
      parent_node = create(:node)
      child1 = create(:node, parent: parent_node)
      child2 = create(:node, parent: parent_node)
      layer = described_class.new(nodes: [child1, child2])
      expect(layer).to be_valid
    end

    it '持っているnodesが0個のときは有効になる' do
      layer = described_class.new(nodes: [])
      expect(layer).to be_valid
    end

    it 'operationにenum定義外の数値を入れるとArgumentErrorになる' do
      expect do
        described_class.new(operation: 999)
      end.to raise_error(ArgumentError)
    end

    it 'fraction に数値以外の値が入ると無効になる' do
      layer = described_class.new(fraction: 'test string')
      layer.valid?
      expect(layer.errors[:fraction]).to include('is not a number')
    end

    it 'fraction はnilを設定できる' do
      layer = described_class.new(fraction: nil)
      layer.valid?
      expect(layer.errors[:fraction]).to be_empty
    end
  end

  describe NodesParentValidator do
    it '持っているノードにparent_idが異なるものが含まれていると無効になる' do
      parent1 = create(:node)
      parent2 = create(:node)
      child1 = create(:node, parent: parent1)
      child2 = create(:node, parent: parent2)
      layer = Layer.new(nodes: [child1, child2])
      layer.valid?
      expect(layer.errors[:nodes_parent]).to include('all nodes in a Layer must have the same parent')
    end

    it '持っているノードが2つ以上かつparent_idが全てnilのときは無効になる' do
      node1 = build(:node, parent: nil)
      node2 = build(:node, parent: nil)
      layer = Layer.new(nodes: [node1, node2])
      layer.valid?
      expect(layer.errors[:nodes_parent]).to include('all nodes in a Layer must have the same parent')
    end
  end

  describe NodesCountValidator do
    it '持っているnodesが1個のときは無効になる' do
      node = create(:node)
      layer = Layer.new(nodes: [node])
      layer.valid?
      expect(layer.errors[:nodes_count]).to include('must have 0 or 2 or more nodes')
    end
  end
end
