# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Welcome pages', type: :system do
  scenario 'user views the welcome pages' do
    visit root_path
    expect(page).to have_selector 'nav', text: 'KPIツリーメーカー'
    expect(page).to have_selector 'button', text: 'ログインなしで試す'

    click_link '利用規約'
    expect(page).to have_selector 'h1', text: '利用規約'

    click_link '戻る'
    expect(page).to have_selector 'button', text: 'ログインなしで試す'
    click_link 'プライバシーポリシー'
    expect(page).to have_selector 'h1', text: 'プライバシーポリシー'
  end
end
