# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Welcome pages' do
  it 'LPを表示する' do
    visit root_path
    expect(page).to have_css('img.ktg-logo-image')
    expect(page).to have_button text: 'サインアップ（無料）'
  end

  it 'LPのリンクから利用規約へ遷移する' do
    visit root_path
    click_link '利用規約'
    expect(page).to have_selector 'h1', text: '利用規約'
  end

  it '利用規約から「トップへ」リンクでLPに戻る' do
    visit terms_of_use_path
    click_link 'トップへ'
    expect(page).to have_button text: 'サインアップ（無料）'
  end

  it 'LPのリンクからプライバシーポリシーへ遷移する' do
    visit root_path
    click_link 'プライバシーポリシー'
    expect(page).to have_selector 'h1', text: 'プライバシーポリシー'
  end

  it 'プライバシーポリシーから「トップへ」リンクでLPに戻る' do
    visit privacy_policy_path
    click_link 'トップへ'
    expect(page).to have_button text: 'サインアップ（無料）'
  end

  it 'サインアップボタンからログイン完了するとツリー一覧ページに遷移する' do
    visit root_path
    click_button 'サインアップ（無料）'
    expect(page).to have_selector 'h1', text: 'ツリー一覧'
  end

  it 'ログインボタンからログイン完了するとツリー一覧ページに遷移する' do
    visit root_path
    click_button 'ログイン'
    expect(page).to have_selector 'h1', text: 'ツリー一覧'
  end
end
