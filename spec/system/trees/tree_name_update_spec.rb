# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'ツリー名を変更する', :js, :login_required do
  before do
    visit log_out_path
    visit root_path
    click_button 'Googleでログイン'

    tree = create(:tree, user: User.find_by(uid: '1234'), name: '変更前のツリー名')
    create(:node, name: 'ルート', tree:)
    visit edit_tree_path(tree)
  end

  describe '更新に成功する時' do
    it 'ツリー名を変更できる' do
      expect(find('h1', text: '変更前のツリー名')).to be_present
      expect(find('.edit-tree-name-button')).to be_present
      expect(page).not_to have_css('.edit-tree-name-ok')
      expect(page).not_to have_css('.edit-tree-name-cancel')

      find('.edit-tree-name-button').click
      expect(page).to have_css('.edit-tree-name-ok')
      expect(page).to have_css('.edit-tree-name-cancel')
      expect(page).not_to have_css('.edit-tree-name-button')
      find('input[name="tree-name-input"]').set('変更後のツリー名')
      find('.edit-tree-name-ok').click

      expect(find('h1', text: '変更後のツリー名')).to be_present
      expect(find('.edit-tree-name-button')).to be_present
      expect(page).not_to have_css('.edit-tree-name-ok')
      expect(page).not_to have_css('.edit-tree-name-cancel')
    end

    it 'キャンセルボタンを押すと、名前が変わらないままで完了する' do
      expect(find('h1', text: '変更前のツリー名')).to be_present
      find('.edit-tree-name-button').click
      find('input[name="tree-name-input"]').set('変更後のツリー名')
      find('.edit-tree-name-cancel').click
      expect(find('h1', text: '変更前のツリー名')).to be_present
    end

    it 'ツリー名を変更しないままOKボタンを押すと、名前が変わらないままで完了する' do
      expect(find('h1', text: '変更前のツリー名')).to be_present
      find('.edit-tree-name-button').click
      find('.edit-tree-name-ok').click
      expect(find('h1', text: '変更前のツリー名')).to be_present
    end
  end

  describe '更新に失敗する時' do
    it 'ツリー名が空の状態でOKボタンを押すと、「ツリー名を入力してください」というエラーが表示される' do
      find('.edit-tree-name-button').click
      find('input[name="tree-name-input"]').set('')
      find('.edit-tree-name-ok').click
      expect(page).to have_text('ツリー名を入力してください')
    end

    it 'エラーメッセージが表示された後、キャンセルボタンを押すとエラーが消える' do
      find('.edit-tree-name-button').click
      find('input[name="tree-name-input"]').set('')
      find('.edit-tree-name-ok').click
      expect(page).to have_text('ツリー名を入力してください')
      find('.edit-tree-name-cancel').click
      expect(page).not_to have_text('ツリー名を入力してください')
      expect(page).not_to have_css('.text-error')
    end

    it 'エラーメッセージが表示された後、ツリー名を正しく変更しOKボタンを押して更新が完了すると、エラーが消える' do
      find('.edit-tree-name-button').click
      find('input[name="tree-name-input"]').set('')
      find('.edit-tree-name-ok').click
      expect(page).to have_text('ツリー名を入力してください')

      find('input[name="tree-name-input"]').set('変更後のツリー名')
      find('.edit-tree-name-ok').click
      expect(page).not_to have_text('ツリー名を入力してください')
      expect(page).not_to have_css('.text-error')
      expect(find('h1', text: '変更後のツリー名')).to be_present
    end
  end
end
