# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Tree do
  describe('バリデーション') do
    it 'userとnameがあれば有効な状態である' do
      tree = described_class.new(
        name: 'My first tree',
        user: create(:user)
      )
      expect(tree).to be_valid
    end

    it '参照するuserがnilだと無効になる' do
      tree = described_class.new(user: nil)
      tree.valid?
      expect(tree.errors[:user]).to include('must exist')
    end

    it '存在しないuser_idが設定されると無効になる' do
      tree = described_class.new(user_id: User.maximum(:id).to_i + 1)
      tree.valid?
      expect(tree.errors[:user]).to include('must exist')
    end

    it 'nameがないと無効になる' do
      tree = described_class.new(name: nil)
      tree.valid?
      expect(tree.errors[:name]).to include("can't be blank")
    end

    it 'nameが51文字以上だと無効になる' do
      tree = described_class.new(name: 'a' * 51)
      expect(tree).not_to be_valid
      expect(tree.errors[:name]).to include('is too long (maximum is 50 characters)')
    end
  end

  describe('update_tree_with_params') do
    let(:tree) { create(:tree, user: create(:user)) }
    let!(:root) do
      create(:node, tree:, name: 'ルート', value: 1000, value_format: '万', unit: '円', is_value_locked: true)
    end
    let!(:child1) do
      create(:node, tree:, name: '子1', value: 5000, value_format: 'なし', unit: '人', is_value_locked: false,
                    parent: root)
    end
    let!(:child2) do
      create(:node, tree:, name: '子2', value: 2000, value_format: 'なし', unit: '円', is_value_locked: false,
                    parent: root)
    end
    let!(:children_layer) { create(:layer, tree:, operation: 'multiply', fraction: 0, parent_node: root) }
    let!(:grandchild21) do
      create(:node, tree:, name: '孫2-1', value: 200, value_format: 'なし', unit: '円', is_value_locked: false,
                    parent: child2)
    end
    let!(:grandchild22) do
      create(:node, tree:, name: '孫2-2', value: 1000, value_format: 'なし', unit: '円', is_value_locked: false,
                    parent: child2)
    end
    let!(:grandchild23) do
      create(:node, tree:, name: '孫2-3', value: 800, value_format: 'なし', unit: '円', is_value_locked: false,
                    parent: child2)
    end
    let!(:grand_children_layer) { create(:layer, tree:, operation: 'add', fraction: 0, parent_node: child2) }
    let!(:tree_params) do
      {
        layers: [{
          id: children_layer.id,
          operation: children_layer.operation,
          fraction: children_layer.fraction,
          parent_node_id: root.id,
          tree_id: tree.id
        }, {
          id: grand_children_layer.id,
          operation: grand_children_layer.operation,
          fraction: grand_children_layer.fraction,
          parent_node_id: child2.id,
          tree_id: tree.id
        }],
        nodes: [
          {
            id: root.id,
            name: root.name,
            value: root.value,
            value_format: root.value_format,
            unit: root.unit,
            is_value_locked: root.is_value_locked,
            tree_id: tree.id,
            parent_id: nil
          }, {
            id: child1.id,
            name: child1.name,
            value: child1.value,
            value_format: child1.value_format,
            unit: child1.unit,
            is_value_locked: child1.is_value_locked,
            tree_id: tree.id,
            parent_id: root.id
          }, {
            id: child2.id,
            name: child2.name,
            value: child2.value,
            value_format: child2.value_format,
            unit: child2.unit,
            is_value_locked: child2.is_value_locked,
            tree_id: tree.id,
            parent_id: root.id
          }, {
            id: child2.id,
            name: child2.name,
            value: child2.value,
            value_format: child2.value_format,
            unit: child2.unit,
            is_value_locked: child2.is_value_locked,
            tree_id: tree.id,
            parent_id: root.id
          }, {
            id: grandchild21.id,
            name: grandchild21.name,
            value: grandchild21.value,
            value_format: grandchild21.value_format,
            unit: grandchild21.unit,
            is_value_locked: grandchild21.is_value_locked,
            tree_id: tree.id,
            parent_id: child2.id
          }, {
            id: grandchild22.id,
            name: grandchild22.name,
            value: grandchild22.value,
            value_format: grandchild22.value_format,
            unit: grandchild22.unit,
            is_value_locked: grandchild22.is_value_locked,
            tree_id: tree.id,
            parent_id: child2.id
          }, {
            id: grandchild23.id,
            name: grandchild23.name,
            value: grandchild23.value,
            value_format: grandchild23.value_format,
            unit: grandchild23.unit,
            is_value_locked: grandchild23.is_value_locked,
            tree_id: tree.id,
            parent_id: child2.id
          }
        ]
      }
    end

    describe('新規追加') do
      it('既存レイヤーに新規ノードを追加できる') do
        expect(tree.nodes.count).to eq(6)
        tree_params[:nodes] << {
          name: '孫2-4',
          value: 1000,
          value_format: 'なし',
          unit: '円',
          is_value_locked: false,
          tree_id: tree.id,
          parent_id: child2.id
        }
        tree.update_tree_with_params(tree_params)
        expect(tree.nodes.count).to eq(7)
        expect(tree.nodes.find_by(name: '孫2-4')).to be_present
        expect(tree.nodes.find_by(name: '孫2-4').parent).to eq(child2)
      end

      it('新規レイヤー・新規ノードを追加できる') do
        expect(tree.nodes.count).to eq(6)
        expect(tree.layers.count).to eq(2)
        tree_params[:nodes] += [{
          name: '孫1-1',
          value: 1000,
          value_format: 'なし',
          unit: '人',
          is_value_locked: false,
          tree_id: tree.id,
          parent_id: child1.id
        }, {
          name: '孫1-2',
          value: 4000,
          value_format: 'なし',
          unit: '人',
          is_value_locked: false,
          tree_id: tree.id,
          parent_id: child1.id
        }]
        tree_params[:layers] << {
          operation: 'add',
          fraction: 0,
          parent_node_id: child1.id,
          tree_id: tree.id
        }
        tree.update_tree_with_params(tree_params)
        expect(tree.nodes.count).to eq(8)
        expect(tree.layers.count).to eq(3)
        expect(tree.nodes.find_by(name: '孫1-1')).to be_present
        expect(tree.nodes.find_by(name: '孫1-1').parent).to eq(child1)
        expect(tree.nodes.find_by(name: '孫1-2')).to be_present
        expect(tree.nodes.find_by(name: '孫1-2').parent).to eq(child1)
        expect(tree.layers.find_by(operation: 'add', parent_node_id: child1.id)).to be_present
      end
    end

    describe('更新') do
      it('ルートノードを更新できる') do
        expect(tree.nodes.count).to eq(6)
        expect(tree.layers.count).to eq(2)
        tree_params[:nodes][0][:name] = '更新後ルート'
        tree_params[:nodes][0][:value] = 20_000
        tree_params[:nodes][0][:value_format] = '千'
        tree_params[:nodes][0][:unit] = '円'
        tree_params[:nodes][0][:is_value_locked] = false
        tree.update_tree_with_params(tree_params)
        expect(tree.nodes.count).to eq(6)
        expect(tree.layers.count).to eq(2)
        expect(tree.nodes.find_by(name: '更新後ルート')).to be_present
        root_after_updated = tree.nodes.find_by(name: '更新後ルート')
        expect(root_after_updated.value).to eq(20_000)
        expect(root_after_updated.value_format).to eq('千')
        expect(root_after_updated.unit).to eq('円')
        expect(root_after_updated.is_value_locked).to be(false)
      end

      it('既存レイヤー・既存ノードを更新できる') do
        expect(tree.nodes.count).to eq(6)
        expect(tree.layers.count).to eq(2)
        tree_params[:nodes][1][:name] = '更新後子1'
        tree_params[:nodes][1][:value] = 10_000
        tree_params[:nodes][1][:value_format] = '万'
        tree_params[:nodes][1][:unit] = '円'
        tree_params[:nodes][1][:is_value_locked] = true
        tree_params[:layers][0][:operation] = 'add'
        tree.update_tree_with_params(tree_params)
        expect(tree.nodes.count).to eq(6)
        expect(tree.layers.count).to eq(2)
        expect(tree.nodes.find_by(name: '更新後子1')).to be_present
        child1_after_updated = tree.nodes.find_by(name: '更新後子1')
        expect(child1_after_updated.value).to eq(10_000)
        expect(child1_after_updated.value_format).to eq('万')
        expect(child1_after_updated.unit).to eq('円')
        expect(child1_after_updated.is_value_locked).to be(true)
        expect(tree.layers.find_by(operation: 'add', parent_node_id: root.id)).to be_present
      end
    end

    describe('削除') do
      it('既存レイヤーから葉ノードを削除できる') do
        expect(tree.nodes.count).to eq(6)
        expect(tree.layers.count).to eq(2)
        tree_params[:nodes].reject! { |node| node[:name] == '孫2-3' }
        tree.update_tree_with_params(tree_params)
        expect(tree.nodes.count).to eq(5)
        expect(tree.layers.count).to eq(2)
        expect(tree.nodes.find_by(name: '孫2-3')).to be_nil
      end

      it('既存レイヤーから非葉ノードと、その子孫レイヤー・ノードを削除できる') do
        expect(tree.nodes.count).to eq(6)
        expect(tree.layers.count).to eq(2)
        tree_params[:nodes].reject! { |node| node[:name] == '子2' }
        tree.update_tree_with_params(tree_params)
        expect(tree.nodes.count).to eq(2)
        expect(tree.layers.count).to eq(1)
        expect(tree.nodes.find_by(name: '子2')).to be_nil
        expect(tree.nodes.find_by(name: '孫2-1')).to be_nil
        expect(tree.nodes.find_by(name: '孫2-2')).to be_nil
        expect(tree.nodes.find_by(name: '孫2-3')).to be_nil
        expect(tree.layers.find_by(parent_node_id: child2.id)).to be_nil
      end

      it('既存レイヤーとその中の全てのノード、その子孫レイヤー・ノードを削除できる') do
        expect(tree.nodes.count).to eq(6)
        expect(tree.layers.count).to eq(2)
        tree_params[:nodes].reject! { |node| node[:parent_id] == child2.id }
        tree.update_tree_with_params(tree_params)
        expect(tree.nodes.count).to eq(3)
        expect(tree.layers.count).to eq(1)
        expect(tree.nodes.find_by(name: 'ルート')).to be_present
        expect(tree.nodes.find_by(name: '子1')).to be_present
        expect(tree.nodes.find_by(name: '子2')).to be_present
        expect(tree.layers.find_by(parent_node_id: root.id)).to be_present
        expect(tree.nodes.find_by(name: '孫2-1')).to be_nil
        expect(tree.nodes.find_by(name: '孫2-2')).to be_nil
        expect(tree.nodes.find_by(name: '孫2-3')).to be_nil
        expect(tree.layers.find_by(parent_node_id: child2.id)).to be_nil
      end
    end
  end

  describe('create_default_structure') do
    let(:user) { create(:user) }
    let(:tree) { create(:tree, user:) }

    context '既にツリーにノードが存在するとき' do
      it '何もしないこと' do
        create(:node, tree:)

        expect do
          tree.create_default_structure
        end.not_to change { tree.nodes.count }.from(1)
        expect(tree.layers).to be_empty
      end
    end

    context 'ツリーにノードが存在しないとき' do
      it '設定したデフォルトのノード・レイヤーを作成すること' do
        tree.create_default_structure
        expect(tree.nodes.count).to eq(3)
        expect(tree.layers.count).to eq(1)
        parent_node = tree.nodes.find_by(name: '親の要素')
        expect(parent_node).to be_present
        expect_node(
          node: parent_node,
          value: 100,
          unit: '円',
          value_format: '万',
          is_value_locked: false
        )
        child_node1 = tree.nodes.find_by(name: '子の要素1')
        expect(child_node1).to be_present
        expect(child_node1.parent).to eq(parent_node)
        expect_node(
          node: child_node1,
          value: 1000,
          unit: '円',
          value_format: '万',
          is_value_locked: false
        )
        child_node2 = tree.nodes.find_by(name: '子の要素2')
        expect(child_node2).to be_present
        expect(child_node2.parent).to eq(parent_node)
        expect_node(
          node: child_node2,
          value: 10,
          unit: '',
          value_format: '%',
          is_value_locked: false
        )
        layer = tree.layers.first
        expect(layer).to be_present
        expect(layer.operation).to eq('multiply')
        expect(layer.fraction).to eq(0)
        expect(layer.parent_node).to eq(parent_node)
      end
    end
  end

  describe('latest_updated_atは、そのツリーに含まれるノードまたはレイヤーまたはそのツリー自身の中で、最も新しいupdated_atの値を返す') do
    let!(:user) { create(:user) }
    let!(:tree) { create(:tree, user:, updated_at: 4.days.ago) }
    let!(:parent) { create(:node, tree:, updated_at: 5.days.ago) }

    it 'あるノードのupdated_atが一番新しいとき、そのノードのupdated_atを返すこと' do
      child1 = create(:node, tree:, updated_at: 1.day.ago, parent:)
      create(:node, tree:, updated_at: 2.days.ago, parent:)
      create(:layer, tree:, parent_node: parent, updated_at: 3.days.ago)
      expect(tree.latest_updated_at).to eq(child1.updated_at)
    end

    it 'あるレイヤーのupdated_atが一番新しいとき、そのレイヤーのupdated_atを返すこと' do
      create(:node, tree:, updated_at: 2.days.ago, parent:)
      create(:node, tree:, updated_at: 3.days.ago, parent:)
      layer = create(:layer, tree:, parent_node: parent, updated_at: 1.day.ago)
      expect(tree.latest_updated_at).to eq(layer.updated_at)
    end

    it 'ツリー自身のupdated_atが一番新しいとき、ツリー自身のupdated_atを返すこと' do
      create(:node, tree:, updated_at: 6.days.ago, parent:)
      create(:node, tree:, updated_at: 7.days.ago, parent:)
      create(:layer, tree:, parent_node: parent, updated_at: 8.days.ago)
      expect(tree.latest_updated_at).to eq(tree.updated_at)
    end
  end

  describe 'scope :ordered_by_latest_update は、latest_updated_atの降順でツリーを取得する' do
    it 'latest_updated_atの降順でツリーを取得すること' do
      user = create(:user)
      tree1 = create(:tree, updated_at: 2.days.ago, user:)
      tree2 = create(:tree, updated_at: 3.days.ago, user:)
      create(:node, tree: tree2, updated_at: 1.day.ago)
      expect(user.trees.order_by_latest_updated_at).to eq([tree2, tree1])
    end
  end
end

def expect_node(node:, value:, unit:, value_format:, is_value_locked:)
  expect(node.value).to eq(value)
  expect(node.unit).to eq(unit)
  expect(node.value_format).to eq(value_format)
  expect(node.is_value_locked).to be(is_value_locked)
end
