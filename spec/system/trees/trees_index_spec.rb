# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'ツリー一覧', js: true, login_required: true do
  let!(:user) { User.find_or_create_from_auth_hash(OmniAuth.config.mock_auth[:google_oauth2]) }

  before do
    visit log_out_path
    visit root_path
    click_button 'Googleでログイン'
  end

  describe 'ツリーが0件のときの画面' do
    it('ツリーが0件のときは、テーブルが表示されず、ツリー作成ボタンが表示されること') do
      visit root_path
      expect(page).to have_content('まだツリーがありません。')
      expect(page).to have_button('ツリーを作成する')
      expect(page).not_to have_table
    end
  end

  describe 'ツリーが1件以上存在するときの画面' do
    let!(:tree_times) { [3.days.ago, 2.days.ago, 1.day.ago] }

    before do
      tree_times.each_with_index do |time, index|
        create(:tree, name: "ツリー#{index + 1}", user_id: user.id, updated_at: time)
      end
      visit root_path
    end

    it('ツリーの一覧が表示されること') do
      expect(page).to have_table
      expect(page).to have_selector('table > tbody > tr', count: 3)
      expect(page).to have_selector('table > tbody > tr > td.td-tree-name', text: 'ツリー1')
      expect(page).to have_selector('table > tbody > tr > td.td-tree-name', text: 'ツリー2')
      expect(page).to have_selector('table > tbody > tr > td.td-tree-name', text: 'ツリー3')
      tree_times.reverse.each_with_index do |time, index|
        formatted_time = time.strftime('%Y-%m-%d %H:%M:%S %z')
        expect(page).to have_selector("table > tbody > tr:nth-child(#{index + 1}) > td.td-tree-updated-at",
                                      text: formatted_time)
      end
      expect(page).to have_selector('table > tbody > tr > td.td-tree-action > button', text: '編集', count: 3)
    end

    it('一覧のツリーがupdate_atの降順に並んでいること') do
      timestamps = page.all('table > tbody > tr > td.td-tree-updated-at').map(&:text)
      # フォーマット '2023-09-11 14:23:27 +0900' の文字列をDateTimeオブジェクトに変換
      parsed_timestamps = timestamps.map { |ts| DateTime.strptime(ts, '%Y-%m-%d %H:%M:%S %z') }
      expect(parsed_timestamps).to eq(parsed_timestamps.sort.reverse)
    end

    it('ツリー名をクリックすると、そのツリーの編集画面に遷移すること') do
      most_recent_updated_tree = Tree.order(updated_at: :desc).first
      page.all('table > tbody > tr > td.td-tree-name > a').first.click
      expect(page).to have_current_path(edit_tree_path(most_recent_updated_tree))
    end

    it('編集ボタンをクリックすると、そのツリーの編集画面に遷移すること') do
      most_recent_updated_tree = Tree.order(updated_at: :desc).first
      page.all('table > tbody > tr > td.td-tree-action > button', text: '編集').first.click
      expect(page).to have_current_path(edit_tree_path(most_recent_updated_tree))
    end
  end

  describe 'ページネーションの動作' do
    it('ツリーが10件以下のときはページネーションが表示されないこと') do
      create(:tree, name: 'ツリー1', user_id: user.id)
      visit root_path
      expect(page).not_to have_selector('nav.pagination')
    end

    it('ツリーが11件以上のときはページネーションが表示されること') do
      11.times do |i|
        create(:tree, name: "ツリー#{i + 1}", user_id: user.id)
      end
      visit root_path
      expect(page).to have_selector('nav.pagination')
    end

    it('ツリーが11件以上のときは、1ページに10件のリストが表示されていること') do
      11.times do |i|
        create(:tree, name: "ツリー#{i + 1}", user_id: user.id)
      end
      visit root_path
      expect(page).to have_selector('table > tbody > tr', count: 10)
    end

    it('ページネーションのNextをクリックすると、ツリー一覧が切り替わること') do
      create_list(:tree, 31, user_id: user.id).each_with_index do |tree, index|
        tree.update(name: "ツリー#{index + 1}", updated_at: index.hours.ago)
      end
      visit root_path
      click_link 'Next >'
      expect(page).to have_selector('table > tbody > tr', count: 10)
      expect(first('table > tbody > tr > td.td-tree-name').text).to eq('ツリー11')
    end

    it('ページネーションのPreviousをクリックすると、ツリー一覧が切り替わること') do
      create_list(:tree, 31, user_id: user.id).each_with_index do |tree, index|
        tree.update(name: "ツリー#{index + 1}", updated_at: index.hours.ago)
      end
      visit "#{root_path}?page=2"
      click_link '< Prev'
      expect(page).to have_selector('table > tbody > tr', count: 10)
      expect(first('table > tbody > tr > td.td-tree-name').text).to eq('ツリー1')
    end

    it('ページネーションのFirstをクリックすると、ツリー一覧が切り替わること') do
      create_list(:tree, 31, user_id: user.id).each_with_index do |tree, index|
        tree.update(name: "ツリー#{index + 1}", updated_at: index.hours.ago)
      end
      visit "#{root_path}?page=3"
      click_link '<< First'
      expect(page).to have_selector('table > tbody > tr', count: 10)
      expect(first('table > tbody > tr > td.td-tree-name').text).to eq('ツリー1')
    end

    it('ページネーションのLastをクリックすると、ツリー一覧が切り替わること') do
      create_list(:tree, 31, user_id: user.id).each_with_index do |tree, index|
        tree.update(name: "ツリー#{index + 1}", updated_at: index.hours.ago)
      end
      visit root_path
      click_link 'Last >>'
      expect(page).to have_selector('table > tbody > tr', count: 1)
      expect(first('table > tbody > tr > td.td-tree-name').text).to eq('ツリー31')
    end
  end
end
