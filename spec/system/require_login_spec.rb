# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'ページごとのログイン要否' do
  describe 'ログインしていない時' do
    it('ルートにアクセスするとウェルカムページが表示されること') do
      visit root_path
      expect(page).to have_content('KPIツリーを簡単に')
    end

    it('ウェルカムページにアクセスできること') do
      visit welcome_path
      expect(page).to have_content('KPIツリーを簡単に')
    end

    it('利用規約ページにアクセスできること') do
      visit terms_of_use_path
      expect(page).to have_selector 'h1', text: '利用規約'
    end

    it('プライバシーポリシーページにアクセスできること') do
      visit privacy_policy_path
      expect(page).to have_selector 'h1', text: 'プライバシーポリシー'
    end

    it('ツリー一覧画面にアクセスできず、ウェルカムページにリダイレクトされること') do
      visit trees_path
      expect(page).to have_content(I18n.t('alert.require_login'))
      expect(page).to have_content('KPIツリーを簡単に')
    end

    it('ツリー編集画面にアクセスできず、ウェルカムページにリダイレクトされること') do
      tree = create(:tree)
      visit edit_tree_path(tree)
      expect(page).to have_content(I18n.t('alert.require_login'))
      expect(page).to have_content('KPIツリーを簡単に')
    end
  end

  describe 'ログインしている時' do
    # before do
    #   visit log_out_path
    #   visit root_path
    #   click_button 'Googleでログイン'
    # end

    describe 'ログイン必須の画面' do
      it('ルートにアクセスするとツリー一覧ページが表示されること') do
        puts 'START ルートにアクセスするとツリー一覧ページが表示されること'
        visit log_out_path
        visit root_path
        click_button 'Googleでログイン'

        visit root_path
        expect(page).to have_content('ツリー一覧')
        puts 'END ルートにアクセスするとツリー一覧ページが表示されること'
      end

      it('ツリー一覧画面にアクセスできること') do
        puts 'START ツリー一覧画面にアクセスできること'
        visit log_out_path
        visit root_path
        click_button 'Googleでログイン'

        visit trees_path
        expect(page).to have_content('ツリー一覧')
        puts 'END ツリー一覧画面にアクセスできること'
      end

      it('ツリー編集画面にアクセスできること') do
        puts 'START ツリー編集画面にアクセスできること'
        visit log_out_path
        visit root_path
        click_button 'Googleでログイン'

        tree = create(:tree, user: User.find_by(uid: '1234'))
        visit edit_tree_path(tree)
        expect(page).to have_content('要素を選択すると')
        puts 'END ツリー編集画面にアクセスできること'
      end
    end

    describe 'ログイン不要の画面' do
      it('ウェルカムページにアクセスできること') do
        puts 'START ウェルカムページにアクセスできること'
        visit log_out_path
        visit root_path
        click_button 'Googleでログイン'

        visit welcome_path
        expect(page).to have_content('KPIツリーを簡単に')
        puts 'END ウェルカムページにアクセスできること'
      end

      it('利用規約ページにアクセスできること') do
        puts 'START 利用規約ページにアクセスできること'
        visit log_out_path
        visit root_path
        click_button 'Googleでログイン'

        visit terms_of_use_path
        expect(page).to have_selector 'h1', text: '利用規約'
        puts 'END 利用規約ページにアクセスできること'
      end

      it('プライバシーポリシーページにアクセスできること') do
        puts 'START プライバシーポリシーページにアクセスできること'
        visit log_out_path
        visit root_path
        click_button 'Googleでログイン'

        visit privacy_policy_path
        expect(page).to have_selector 'h1', text: 'プライバシーポリシー'
        puts 'END プライバシーポリシーページにアクセスできること'
      end
    end
  end
end
