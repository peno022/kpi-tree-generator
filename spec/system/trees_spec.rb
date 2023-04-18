# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Tree pages', js: true do
  it('treeの詳細画面に、treeの図が表示されている') do
    tree1 = create(:tree)
    nodes1 = create_list(:node, 3, tree: tree1)
    nodes1[1].name = '子1'
    nodes1[2].name = '子2'
    nodes1[0].children = [nodes1[1], nodes1[2]]
    visit edit_tree_path(tree1)
    expect(page).to have_css('g > text', text: nodes1[0].name)
    expect(page).to have_css('g > text', text: nodes1[1].name)
    expect(page).to have_css('g > text', text: nodes1[2].name)
    expect(page).to have_css('svg > g > path.rd3t-link', count: 2)
  end

  it('treeの子ノードをクリックすると、兄弟ノードの色が変わる') do
    tree2 = create(:tree)
    nodes2 = create_list(:node, 3, tree: tree2)
    nodes2[1].name = '子1'
    nodes2[2].name = '子2'
    nodes2[0].children = [nodes2[1], nodes2[2]]

    visit edit_tree_path(tree2)
    target_node_before = find('g > text', text: '子1').ancestor('g.rd3t-leaf-node')
    sibling_node_before = find('g > text', text: '子2').ancestor('g.rd3t-leaf-node')
    expect(target_node_before.find('rect')[:style]).to include('fill: ghostwhite')
    expect(sibling_node_before.find('rect')[:style]).to include('fill: ghostwhite')
    target_node_before.click
    target_node_after = find('g > text', text: '子1').ancestor('g.rd3t-leaf-node')
    expect(target_node_after.find('rect')[:style]).to include('fill: moccasin')
    sibling_node_after = find('g > text', text: '子2').ancestor('g.rd3t-leaf-node')
    expect(sibling_node_after.find('rect')[:style]).to include('fill: moccasin')
  end

  it('treeのルートノードをクリックすると、ルートノードの色が変わる') do
    tree3 = create(:tree)
    create(:node, name: 'ルート', tree: tree3)

    visit edit_tree_path(tree3)

    target_node_before = find('g > text', text: 'ルート').ancestor('g:not([class])')
    expect(target_node_before.find('rect')[:style]).to include('fill: ghostwhite')
    target_node_before.click
    target_node_after = find('g > text', text: 'ルート').ancestor('g:not([class])')
    expect(target_node_after.find('rect')[:style]).to include('fill: moccasin')
  end
end
