# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Layer do
  it 'operationとparent_nodeがあれば有効になる' do
    node = create(:node)
    layer = described_class.new(parent_node: node, operation: 'かけ算')
    expect(layer).to be_valid
  end

  it 'operationがないと無効になる' do
    layer = described_class.new(operation: nil)
    layer.valid?
    expect(layer.errors[:operation]).to include("can't be blank")
  end

  it 'parent_nodeがnilだと無効になる' do
    layer = described_class.new(parent_node: nil)
    layer.valid?
    expect(layer.errors[:parent_node]).to include('must exist')
  end

  it 'parent_node_idに存在しないIDを指定すると無効になる' do
    layer = described_class.new(parent_node_id: Node.maximum(:id).to_i + 1)
    layer.valid?
    expect(layer.errors[:parent_node]).to include('must exist')
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
