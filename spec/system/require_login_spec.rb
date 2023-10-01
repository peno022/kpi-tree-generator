# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'ページごとのログイン要否' do
  describe 'ログインしていない時' do
    it('ルートにアクセスするとウェルカムページが表示されること') do
      visit root_path
      expect(page).to have_content('KPI ツリーをかんたん作成')
    end

    it('ウェルカムページにアクセスできること') do
      visit welcome_path
      expect(page).to have_content('KPI ツリーをかんたん作成')
    end

    it('利用規約ページにアクセスできること') do
      visit terms_of_use_path
      expect(page).to have_selector 'h1', text: '利用規約'
    end

    it('プライバシーポリシーページにアクセスできること') do
      visit privacy_policy_path
      expect(page).to have_selector 'h1', text: 'プライバシーポリシー'
    end

    it('ツリー編集画面にアクセスできず、ウェルカムページにリダイレクトされること') do
      tree = create(:tree)
      visit edit_tree_path(tree)
      expect(page).to have_content(I18n.t('alert.require_login'))
      expect(page).to have_content('KPI ツリーをかんたん作成')
    end
  end

  describe 'ログインしている時', :login_required do
    before do
      visit log_out_path
      visit root_path
      click_button 'ログイン'
    end

    describe 'ログイン必須の画面' do
      it('ルートにアクセスするとツリー一覧ページが表示されること') do
        visit root_path
        expect(page).to have_content('ツリー一覧')
      end

      it('ツリー編集画面にアクセスできること') do
        tree = create(:tree, user: User.find_by(uid: '1234'))
        visit edit_tree_path(tree)
        expect(page).to have_content('要素を選択すると')
      end
    end

    describe 'ログイン不要の画面' do
      it('ウェルカムページにアクセスできること') do
        visit welcome_path
        expect(page).to have_content('KPI ツリーをかんたん作成')
        expect(page).to have_content('ログアウト')
      end

      it('利用規約ページにアクセスできること') do
        visit terms_of_use_path
        expect(page).to have_selector 'h1', text: '利用規約'
      end

      it('プライバシーポリシーページにアクセスできること') do
        visit privacy_policy_path
        expect(page).to have_selector 'h1', text: 'プライバシーポリシー'
      end
    end
  end
end
