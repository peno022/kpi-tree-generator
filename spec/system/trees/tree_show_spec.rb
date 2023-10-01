# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Tree pages', :js do
  describe 'ツリー編集画面', :login_required do
    before do
      visit log_out_path
      visit root_path
      click_button 'ログイン'

      tree = create(:tree, user: User.find_by(uid: '1234'))
      root = create(:node, name: 'ルート', tree:)
      create(:node, name: '子1', tree:, parent: root)
      create(:node, name: '子2', tree:, parent: root)
      create(:layer, parent_node: root, tree:)
      visit edit_tree_path(tree)
    end

    it('ログインユーザーのものでないツリーにはアクセスできない') do
      tree = create(:tree)
      visit edit_tree_path(tree)
      expect(page).to have_content('404')
    end

    it('treeの詳細画面に、treeの図が表示されている') do
      expect(page).to have_css('g > text', text: 'ルート')
      expect(page).to have_css('g > text', text: '子1')
      expect(page).to have_css('g > text', text: '子2')
      expect(page).to have_css('svg > g > path.rd3t-link', count: 2)
      expect(page).to have_content('要素を選択すると、ここに詳細が表示されます。')
    end

    it('treeの子ノードをクリックすると、兄弟ノードの色が変わり、ノード詳細が要素のid順で表示される。') do
      target_node_before = find('g > text', text: '子1').ancestor('g.custom-node')
      sibling_node_before = find('g > text', text: '子2').ancestor('g.custom-node')
      expect(target_node_before.find('rect')[:style]).to include('fill: ghostwhite')
      expect(sibling_node_before.find('rect')[:style]).to include('fill: ghostwhite')
      target_node_before.click
      target_node_after = find('g > text', text: '子1').ancestor('g.custom-node')
      expect(target_node_after.find('rect')[:style]).to include('fill: moccasin')
      sibling_node_after = find('g > text', text: '子2').ancestor('g.custom-node')
      expect(sibling_node_after.find('rect')[:style]).to include('fill: moccasin')

      # ツールエリアにクリックしたノードの階層の詳細が表示されていること
      expect(page).to have_content('要素間の関係')
      expect(find_by_id('node-detail-1')).to have_css('input[value="子1"]')
      expect(find_by_id('node-detail-2')).to have_css('input[value="子2"]')
    end

    it('treeのルートノードをクリックすると、ルートノードの色が変わり、ノード詳細が表示される。') do
      tree3 = create(:tree, user: User.find_by(uid: '1234'))
      create(:node, name: 'ルート', tree: tree3)

      visit edit_tree_path(tree3)

      # クリックしたルートノードの色が変わること
      target_node_before = find('g > text', text: 'ルート').ancestor('g.custom-node')
      expect(target_node_before.find('rect')[:style]).to include('fill: ghostwhite')
      target_node_before.click
      target_node_after = find('g > text', text: 'ルート').ancestor('g.custom-node')
      expect(target_node_after.find('rect')[:style]).to include('fill: moccasin')

      # ツールエリアにクリックしたノードの階層の詳細が表示されていること
      expect(page).to have_content('要素1')
      expect(page).not_to have_content('要素間の関係')
      expect(page).to have_css('input[value="ルート"]')
    end

    it('任意の要素をクリック後に別な階層の要素をクリックすると、表示される項目が変わること') do
      # データの作成
      tree = create(:tree, user: User.find_by(uid: '1234'))
      root_node = create(:node, tree:, name: 'ルート', value: 1000, value_format: '万', unit: '円', is_value_locked: true)
      child_node1 = create(:node, tree:, name: '子1', value: 5000, value_format: 'なし', unit: '人', is_value_locked: false,
                                  parent: root_node)
      create(:node, tree:, name: '子2', value: 2000, value_format: 'なし', unit: '円', is_value_locked: false,
                    parent: root_node)
      create(:layer, tree:, operation: 'multiply', fraction: 0, parent_node: root_node)
      create(:node, tree:, name: '孫1-1', value: 500, value_format: 'なし', unit: '人', is_value_locked: false,
                    parent: child_node1)
      create(:node, tree:, name: '孫1-2', value: 2.5, value_format: '千', unit: '円', is_value_locked: false,
                    parent: child_node1)
      create(:node, tree:, name: '孫1-3', value: 1, value_format: '%', unit: '', is_value_locked: false,
                    parent: child_node1)
      create(:layer, tree:, operation: 'add', fraction: 0, parent_node: child_node1)

      # ツリー編集画面を表示し、ノードをクリックしてツールエリアを開く
      visit edit_tree_path(tree)
      find('g > text', text: '孫1-1').ancestor('g.rd3t-leaf-node').click
      expect_node_detail(
        index: 1, name: '孫1-1', value: '500', value_format: 'なし', unit: '人', is_value_locked: false
      )
      expect_node_detail(
        index: 2, name: '孫1-2', value: '2.5', value_format: '千', unit: '円', is_value_locked: false
      )
      expect_node_detail(
        index: 3, name: '孫1-3', value: '1', value_format: '%', unit: '', is_value_locked: false
      )

      find('g > text', text: '子2').ancestor('g.rd3t-leaf-node').click
      expect_node_detail(
        index: 1, name: '子1', value: '5000', value_format: 'なし', unit: '人', is_value_locked: false
      )
      expect_node_detail(
        index: 2, name: '子2', value: '2000', value_format: 'なし', unit: '円', is_value_locked: false
      )
    end

    it('親ノードとの数値が合っていない階層は、！アイコンが各ノードとツールエリアに表示される') do
      tree = create(:tree, user: User.find_by(uid: '1234'))
      root = create(:node, name: 'ルート', value: 1000, unit: '円', tree:)
      create(:node, name: '子1', value: 200, unit: '円', tree:, parent: root)
      create(:node, name: '子2', value: 700, unit: '円', tree:, parent: root)
      create(:layer, operation: 'add', parent_node: root, tree:, fraction: 0)
      visit edit_tree_path(tree)
      expect_tree_node(name: 'ルート', display_value: '1000円', is_value_locked: false, is_leaf: false,
                       has_inconsistent_value: false)
      expect_tree_node(name: '子1', display_value: '200円', is_value_locked: false, is_leaf: true,
                       has_inconsistent_value: true)
      expect_tree_node(name: '子2', display_value: '700円', is_value_locked: false, is_leaf: true,
                       has_inconsistent_value: true)
      find('g > text', text: '子2').ancestor('g.rd3t-leaf-node').click
      expect(find('.calculation')).to have_css('svg.fa-triangle-exclamation')
    end
  end
end
