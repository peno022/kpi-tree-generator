# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'ツリー上で葉ノードに子階層を追加する', :js, :login_required do
  before do
    visit log_out_path
    visit root_path
    click_button 'ログイン'

    # データの作成
    tree = create(:tree, user: User.find_by(uid: '1234'))
    root_node = create(:node, tree:, name: 'ルート', value: 1000, value_format: '万', unit: '円', is_value_locked: true)
    create(:node, tree:, name: '子1', value: 5000, value_format: 'なし', unit: '人', is_value_locked: false,
                  parent: root_node)
    child_node2 = create(:node, tree:, name: '子2', value: 2000, value_format: 'なし', unit: '円', is_value_locked: false,
                                parent: root_node)
    create(:layer, tree:, operation: 'multiply', fraction: 0, parent_node: root_node)
    create(:node, tree:, name: '孫2-1', value: 200, value_format: 'なし', unit: '円', is_value_locked: false,
                  parent: child_node2)
    create(:node, tree:, name: '孫2-2', value: 1000, value_format: 'なし', unit: '円', is_value_locked: false,
                  parent: child_node2)
    create(:node, tree:, name: '孫2-3', value: 800, value_format: 'なし', unit: '円', is_value_locked: false,
                  parent: child_node2)
    create(:layer, tree:, operation: 'add', fraction: 0, parent_node: child_node2)

    # ツリー編集画面にアクセス
    visit edit_tree_path(tree)
  end

  describe '葉ノード以外には子階層を追加できない' do
    it 'ルートノードにホバーしても、↓ボタンが表示されない' do
      expect(page).not_to have_css('g.add-layer-button')
      root_node = find('g.custom-node', text: 'ルート')
      root_node.hover

      expect(page).not_to have_css('g.add-layer-button')
    end

    it '葉ノード以外の子ノードにホバーしても、↓ボタンが表示されない' do
      expect(page).not_to have_css('g.add-layer-button')
      non_leaf_node = find('g.custom-node', text: '子2')
      non_leaf_node.hover

      expect(page).not_to have_css('g.add-layer-button')
    end
  end

  describe '葉ノードに子階層を追加できる' do
    it '葉ノードにホバーすると、↓ボタンが表示される' do
      expect(page).not_to have_css('g.add-layer-button')
      leaf_node = find('g.custom-node', text: '孫2-3')
      leaf_node.hover

      expect(page).to have_css('g.add-layer-button')
    end

    it '葉ノードからホバーを外すと、↓ボタンが非表示になる' do
      leaf_node = find('g.custom-node', text: '孫2-3')
      leaf_node.hover
      expect(page).to have_css('g.add-layer-button')

      # ホバーを外すために別な非葉ノードをクリック
      find('g.custom-node', text: '子2').click

      expect(page).not_to have_css('g.add-layer-button')
    end

    it '↓ボタンにホバーすると、ホバーを検知してhoveredクラスを追加する（ホバーを検知するとボタンの色が変わるが、クラスを付与できていることを通して確認）' do
      find('g.custom-node', text: '孫2-3').hover
      expect(page).to have_css('g.add-layer-button:not(.hovered)')
      add_layer_button = find('g.add-layer-button')
      add_layer_button.hover
      expect(page).to have_css('g.add-layer-button.hovered')
      find('g.custom-node', text: '孫2-3').hover # ↓ボタンからホバーを外す
      expect(page).to have_css('g.add-layer-button:not(.hovered)')
    end

    it '葉ノードにホバーして↓ボタンをクリックすると、子階層が追加される。追加された新しい子階層が選択状態で表示される' do
      find('g.custom-node', text: '孫2-3').hover
      find('g.add-layer-button').click
      created_nodes = all('g.custom-node', text: '新規の要素')
      expect(created_nodes.size).to eq 2
      created_nodes.each do |node|
        expect(node.find('rect')[:style]).to include('fill: rgb(209, 250, 229)')
      end
      expect_node_detail(
        index: 1, name: '新規の要素', value: '1', value_format: 'なし', unit: '', is_value_locked: false
      )
      expect_node_detail(
        index: 2, name: '新規の要素', value: '1', value_format: 'なし', unit: '', is_value_locked: false
      )
    end
  end
end
