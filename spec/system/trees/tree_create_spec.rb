# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'ツリーを新規作成する', :js, :login_required do
  let!(:user) { User.find_or_create_from_auth_hash(OmniAuth.config.mock_auth[:google_oauth2]) }

  before do
    visit log_out_path
    visit root_path
    click_button 'Googleでログイン'
    visit root_path
  end

  it '既にユーザーのツリーが1件以上あるときは、ツリー一覧上部の「新規作成」ボタンからツリーを新規作成でき、ツリー編集画面に遷移する' do
    create(:tree, name: 'ツリー1', user_id: user.id)
    visit root_path
    expect(page).to have_button('新規作成')
    expect(page).not_to have_button('ツリーを作成する')
    click_button '新規作成'
    expect(page).to have_current_path(edit_tree_path(user.trees.last))
  end

  it 'ユーザーのツリーが0件のときは、画面内の「ツリーを作成する」ボタンから新規作成でき、ツリー編集画面に遷移する' do
    expect(page).not_to have_button('新規作成')
    expect(page).to have_button('ツリーを作成する')
    click_button 'ツリーを作成する'
    expect(page).to have_current_path(edit_tree_path(user.trees.last))
  end

  it '作成されたツリーの名前は、「新しいツリー」になっている' do
    click_button 'ツリーを作成する'
    expect(page).to have_current_path(edit_tree_path(user.trees.last))
    expect(find('h1', text: '新しいツリー')).to be_present
  end

  it '作成されたツリーは、デフォルトのツリー構造を持っている' do
    click_button 'ツリーを作成する'
    expect_tree_node(
      name: '親の要素',
      display_value: '100万円',
      is_value_locked: false,
      is_leaf: false,
      operation: nil,
      has_inconsistent_value: false
    )
    expect_tree_node(
      name: '子の要素1',
      display_value: '1000万円',
      is_value_locked: false,
      is_leaf: true,
      operation: 'multiply',
      has_inconsistent_value: false
    )
    expect_tree_node(
      name: '子の要素2',
      display_value: '10%',
      is_value_locked: false,
      is_leaf: true,
      operation: nil,
      has_inconsistent_value: false
    )
  end

  it 'ツリー一覧画面に戻ると、作成されたツリーが表示されている' do
    click_button 'ツリーを作成する'
    expect(find('h1', text: '新しいツリー')).to be_present
    find('a', text: 'ホーム').click
    expect(page).to have_selector('table > tbody > tr > td.td-tree-name', text: '新しいツリー')
  end

  it '新規作成したツリーの名前を変更して保存できる' do
    click_button 'ツリーを作成する'
    find('.edit-tree-name-button').click
    find('input[name="tree-name-input"]').set('変更後のツリー名')
    find('.edit-tree-name-ok').click
    expect(find('h1', text: '変更後のツリー名')).to be_present
    find('a', text: 'ホーム').click
    expect(page).to have_selector('table > tbody > tr > td.td-tree-name', text: '変更後のツリー名')
  end

  it '新規作成したツリーのノードを編集して保存できる' do
    click_button 'ツリーを作成する'
    find('g > text', text: '子の要素1').ancestor('g.custom-node').click
    find_by_id('node-detail-1').find('input[name="name"]').set('子の要素1編集後')
    find('#updateButton label', text: '更新').click
    find('.modal-action label', text: '更新する').click
    expect_tree_node(
      name: '親の要素',
      display_value: '100万円',
      is_value_locked: false,
      is_leaf: false,
      operation: nil,
      has_inconsistent_value: false
    )
    expect_tree_node(
      name: '子の要素1編集後',
      display_value: '1000万円',
      is_value_locked: false,
      is_leaf: true,
      operation: 'multiply',
      has_inconsistent_value: false
    )
    expect_tree_node(
      name: '子の要素2',
      display_value: '10%',
      is_value_locked: false,
      is_leaf: true,
      operation: nil,
      has_inconsistent_value: false
    )
  end
end
