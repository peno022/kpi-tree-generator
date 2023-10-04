# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Node do
  describe 'reference' do
    it '存在しないtree_idを指定すると無効になる' do
      node = described_class.new(tree_id: Tree.maximum(:id).to_i + 1)
      node.valid?
      expect(node.errors[:tree]).to include('must exist')
    end

    it '所属する親ノードを持つことができる' do
      node = described_class.new(parent: create(:node))
      node.valid?
      expect(node.errors[:parent]).to be_empty
    end
  end

  describe 'nodeのカスタムバリデーション' do
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

  describe 'default値' do
    it 'is_value_lockedはデフォルト値がfalseになる' do
      node = described_class.new
      expect(node.is_value_locked).to be false
    end
  end

  describe 'percent_formatted?' do
    it "value_format が'なし'のとき" do
      node = described_class.new(value_format: 0)
      expect(node.percent_formatted?).to be false
    end

    it "value_format が'%'のとき" do
      node = described_class.new(value_format: 1)
      expect(node.percent_formatted?).to be true
    end

    it "value_format が'千'のとき" do
      node = described_class.new(value_format: 2)
      expect(node.percent_formatted?).to be false
    end

    it "value_format が'万'のとき" do
      node = described_class.new(value_format: 3)
      expect(node.percent_formatted?).to be false
    end
  end
end
