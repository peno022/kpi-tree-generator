# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Tree pages', js: true, pending: '初期表示時に画面枠外に出てしまって見えないノードのクリックや存在確認ができないため。issue#152で初期表示位置の修正時にテストが通るようにする' do
  it('treeの詳細画面に、treeの図が表示されている') do
    tree1 = create(:tree)
    nodes = create_list(:node, 3, tree: tree1)
    nodes[1].name = '子1'
    nodes[2].name = '子2'
    nodes[0].children = [nodes[1], nodes[2]]
    visit edit_tree_path(tree1)
    expect(page).to have_css('g > text', text: nodes[0].name)
    expect(page).to have_css('g > text', text: nodes[1].name)
    expect(page).to have_css('g > text', text: nodes[2].name)
    expect(page).to have_css('svg > g > path.rd3t-link', count: 2)
  end

  it('treeの子ノードをクリックすると、兄弟ノードの色が変わる') do
    tree1 = create(:tree)
    nodes = create_list(:node, 3, tree: tree1)
    nodes[1].name = '子1'
    nodes[2].name = '子2'
    nodes[0].children = [nodes[1], nodes[2]]

    visit edit_tree_path(tree1)
    target_node = find('g > text', text: '子1').ancestor('g')
    sibling_node_before = find('g > text', text: '子2').ancestor('g.rd3t-leaf-node')
    expect(target_node.child('rect')[:style]).to include('fill: ghostwhite')
    expect(sibling_node_before.find('rect')[:style]).to include('fill: ghostwhite')
    sibling_node_before.click
    expect(target_node.child('rect')[:style]).to include('fill: moccasin')
    sibling_node_after = find('g > text', text: '子2').ancestor('g.rd3t-leaf-node')
    expect(sibling_node_after.find('rect')[:style]).to include('fill: moccasin')
  end

  it('treeのルートノードをクリックすると、ルートノードの色が変わる') do
    tree1 = create(:tree)
    create(:node, tree: tree1, name: 'ルートノード')
    visit edit_tree_path(tree1)

    target_node_before = find('svg > g > g > g > text', text: 'ルートノード').ancestor('g.rd3t-leaf-node')
    expect(target_node_before.find('rect')[:style]).to include('fill: ghostwhite')
    target_node_before.click
    target_node_after = find('svg > g > g > g > text', text: 'ルートノード').ancestor('g.rd3t-leaf-node')
    expect(target_node_after.find('rect')[:style]).to include('fill: moccasin')
  end
end
