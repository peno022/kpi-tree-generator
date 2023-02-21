# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Node do
  before do
    @user = User.create()
    @tree = Tree.create(name: 'my tree', user: @user)
    @layer = Layer.create
  end

  describe 'reference' do
    it '所属するtreeがないと無効になる' do
      node = described_class.new(tree: nil)
      node.valid?
      expect(node.errors[:tree]).to include('must exist')
    end

    it '所属するlayerがないと無効になる' do
      node = described_class.new(layer: nil)
      node.valid?
      expect(node.errors[:layer]).to include('must exist')
    end

    it '所属する親ノードを持つことができる' do
      parent_node = described_class.create(
        name: 'valid node',
        value: 1.5,
        value_format: 0,
        tree: @tree,
        layer: @layer
      )
      node = described_class.new(parent: parent_node)
      node.valid?
      expect(node.errors[:parent]).to be_empty
    end
  end

  describe 'validations for node' do
    it 'name, value, value_format, tree_id, layer_idがあれば有効な状態である' do
      node = described_class.new(
        name: 'valid node',
        value: 1.5,
        value_format: 0,
        tree: @tree,
        layer: @layer
      )
      expect(node).to be_valid
    end

    it 'nameがないと無効になる' do
      node = described_class.new(name: nil)
      node.valid?
      expect(node.errors[:name]).to include("can't be blank")
    end

    it 'valueがないと無効になる' do
      node = described_class.new(value: nil)
      node.valid?
      expect(node.errors[:value]).to include("can't be blank")
    end

    it 'valueに数値以外を入れると無効になる' do
      node = described_class.new(value: 'test string')
      node.valid?
      expect(node.errors[:value]).to include("is not a number")
    end

    it 'value_formatがないと無効になる' do
      node = described_class.new(value_format: nil)
      node.valid?
      expect(node.errors[:value_format]).to include("can't be blank")
    end

    it 'value_formatにenum定義外の数値を入れるとArgumentError' do
      expect {
        node = described_class.new(value_format: 999)
      }.to raise_error(ArgumentError)
    end

    it '表示形式が%のときはunitが空欄でないと無効になる' do
      node = described_class.new(
        value_format: 1,
        unit: '円'
      )
      node.valid?
      expect(node.errors[:unit]).to include('must be blank')
    end
    
    it '表示形式が%以外のときはunitに値が入ってよい' do
      node = described_class.new(
        value_format: 0,
        unit: '円'
      )
      node.valid?
      expect(node.errors[:unit]).to be_empty
    end
    
  end

  describe 'default values' do
    it 'is_value_lockedはデフォルト値がfalseになる' do
      node = described_class.new()
      expect(node.is_value_locked).to eq false
    end
  end

  describe 'percent_formatted?' do
    it "value_format が'なし'のとき" do
      node = described_class.new(value_format: 0)
      expect(node.percent_formatted?).to eq false
    end
    it "value_format が'%'のとき" do
      node = described_class.new(value_format: 1)
      expect(node.percent_formatted?).to eq true
    end
    it "value_format が'千'のとき" do
      node = described_class.new(value_format: 2)
      expect(node.percent_formatted?).to eq false
    end
    it "value_format が'万'のとき" do
      node = described_class.new(value_format: 3)
      expect(node.percent_formatted?).to eq false
    end
  end
end
