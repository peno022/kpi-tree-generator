# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'ツリー一覧', :js, :login_required do
  let!(:user) { User.find_or_create_from_auth_hash(OmniAuth.config.mock_auth[:google_oauth2]) }

  before do
    visit log_out_path
    visit root_path
    click_button 'ログイン'
  end

  describe 'ツリーが0件のときの画面' do
    it 'ツリーが0件のときは、テーブルが表示されず、ツリー作成ボタンが表示されること' do
      visit root_path
      expect(page).to have_content('まだツリーがありません。')
      expect(page).to have_button('ツリーを作成する')
      expect(page).not_to have_table
    end
  end

  describe 'ツリーが1件以上存在するときの画面' do
    let!(:tree_times) { [3.days.ago, 2.days.ago, 1.day.ago] }
    let!(:tree1) { create(:tree, name: 'ツリー1', user_id: user.id, updated_at: tree_times[0]) }
    let!(:tree2) { create(:tree, name: 'ツリー2', user_id: user.id, updated_at: tree_times[1]) }
    let!(:tree3) { create(:tree, name: 'ツリー3', user_id: user.id, updated_at: tree_times[2]) }

    before do
      visit root_path
    end

    it 'ツリーの一覧が表示されること' do
      expect(page).to have_table
      expect(page).to have_selector('table > tbody > tr', count: 3)
      expect(page).to have_selector('table > tbody > tr > td.td-tree-name', text: 'ツリー1')
      expect(page).to have_selector('table > tbody > tr > td.td-tree-name', text: 'ツリー2')
      expect(page).to have_selector('table > tbody > tr > td.td-tree-name', text: 'ツリー3')
      tree_times.reverse.each_with_index do |time, index|
        formatted_time = time.strftime('%Y-%m-%d %H:%M:%S')
        expect(page).to have_selector("table > tbody > tr:nth-child(#{index + 1}) > td.td-tree-updated-at",
                                      text: formatted_time)
      end
      expect(page).to have_selector('table > tbody > tr > td.td-tree-action > button', text: '編集', count: 3)
    end

    it '一覧のツリーがlatest_update_atの降順に並んでいること' do
      # 新しい順にtree3, tree2, tree1
      # tree1内のノードのupdated_atを更新してtree1の最終更新が最新になるようにする（tree1, tree3, tree2の順)
      tree1_new_node = create(:node, name: 'ルート', tree_id: tree1.id, updated_at: 1.hour.ago)
      visit root_path
      timestamps = page.all('table > tbody > tr > td.td-tree-updated-at').map(&:text)
      expect_timestamps = [tree1_new_node.updated_at, tree3.updated_at, tree2.updated_at].map do |ts|
        ts.strftime('%Y-%m-%d %H:%M:%S')
      end
      timestamps.each_with_index do |timestamp, index|
        expect(timestamp).to eq(expect_timestamps[index])
      end
    end

    it 'ツリー名をクリックすると、そのツリーの編集画面に遷移すること' do
      most_recent_updated_tree = user.trees.order_by_latest_updated_at.first
      page.all('table > tbody > tr > td.td-tree-name > a').first.click
      expect(page).to have_current_path(edit_tree_path(most_recent_updated_tree))
    end

    it '編集ボタンをクリックすると、そのツリーの編集画面に遷移すること' do
      most_recent_updated_tree = user.trees.order_by_latest_updated_at.first
      page.all('table > tbody > tr > td.td-tree-action > button', text: '編集').first.click
      expect(page).to have_current_path(edit_tree_path(most_recent_updated_tree))
    end
  end

  describe 'ページネーションの動作' do
    it 'ツリーが10件以下のときはページネーションが表示されないこと' do
      create(:tree, name: 'ツリー1', user_id: user.id)
      visit root_path
      expect(page).not_to have_selector('nav.pagination')
    end

    it 'ツリーが11件以上のときはページネーションが表示されること' do
      11.times do |i|
        create(:tree, name: "ツリー#{i + 1}", user_id: user.id)
      end
      visit root_path
      expect(page).to have_selector('nav.pagination')
    end

    it 'ツリーが11件以上のときは、1ページに10件のリストが表示されていること' do
      11.times do |i|
        create(:tree, name: "ツリー#{i + 1}", user_id: user.id)
      end
      visit root_path
      expect(page).to have_selector('table > tbody > tr', count: 10)
    end

    it 'ページネーションのNextをクリックすると、ツリー一覧が切り替わること' do
      create_list(:tree, 31, user_id: user.id).each_with_index do |tree, index|
        tree.update(name: "ツリー#{index + 1}", updated_at: index.hours.ago)
      end
      visit root_path
      click_link 'Next >'
      expect(page).to have_selector('table > tbody > tr', count: 10)
      expect(first('table > tbody > tr > td.td-tree-name').text).to eq('ツリー11')
    end

    it 'ページネーションのPreviousをクリックすると、ツリー一覧が切り替わること' do
      create_list(:tree, 31, user_id: user.id).each_with_index do |tree, index|
        tree.update(name: "ツリー#{index + 1}", updated_at: index.hours.ago)
      end
      visit "#{root_path}?page=2"
      click_link '< Prev'
      expect(page).to have_selector('table > tbody > tr', count: 10)
      expect(first('table > tbody > tr > td.td-tree-name').text).to eq('ツリー1')
    end

    it 'ページネーションのFirstをクリックすると、ツリー一覧が切り替わること' do
      create_list(:tree, 31, user_id: user.id).each_with_index do |tree, index|
        tree.update(name: "ツリー#{index + 1}", updated_at: index.hours.ago)
      end
      visit "#{root_path}?page=3"
      click_link '<< First'
      expect(page).to have_selector('table > tbody > tr', count: 10)
      expect(first('table > tbody > tr > td.td-tree-name').text).to eq('ツリー1')
    end

    it 'ページネーションのLastをクリックすると、ツリー一覧が切り替わること' do
      create_list(:tree, 31, user_id: user.id).each_with_index do |tree, index|
        tree.update(name: "ツリー#{index + 1}", updated_at: index.hours.ago)
      end
      visit root_path
      click_link 'Last >>'
      expect(page).to have_selector('table > tbody > tr', count: 1)
      expect(first('table > tbody > tr > td.td-tree-name').text).to eq('ツリー31')
    end
  end

  describe 'ツリーの削除' do
    context 'ツリーが2件以上あるとき' do
      let!(:tree1) { create(:tree, name: 'ツリー1', user_id: user.id, updated_at: 1.day.ago) }

      before do
        create(:tree, name: 'ツリー2', user_id: user.id, updated_at: 2.days.ago)
        visit root_path
      end

      it 'ツリーの削除ボタンをクリックすると、削除実行確認モーダルが開くこと' do
        find('table > tbody > tr > td.td-tree-name > a', text: 'ツリー1').ancestor('tr').find('td.td-tree-action > label',
                                                                                              text: '削除').click
        expect(page).to have_content('ツリー1を削除してよろしいですか？')
      end

      it '削除実行確認モーダルでキャンセルをクリックすると、モーダルが閉じること' do
        find('table > tbody > tr > td.td-tree-name > a', text: 'ツリー1').ancestor('tr').find('td.td-tree-action > label',
                                                                                              text: '削除').click
        find('label', text: 'キャンセル').click
        expect(page).not_to have_content('ツリー1を削除してよろしいですか？')
      end

      it '削除を実行するとツリーが削除され、ツリー一覧から消えること' do
        expect(page).to have_selector('table > tbody > tr > td.td-tree-name', text: 'ツリー1')
        expect(page).to have_selector('table > tbody > tr > td.td-tree-name', text: 'ツリー2')
        expect(Tree.where(user_id: user.id).count).to eq(2)
        find('table > tbody > tr > td.td-tree-name > a', text: 'ツリー1').ancestor('tr').find('td.td-tree-action > label',
                                                                                              text: '削除').click
        click_button '削除する'
        expect(Tree.where(user_id: user.id).count).to eq(1)
        expect(page).not_to have_selector('table > tbody > tr > td.td-tree-name', text: 'ツリー1')
        expect(page).to have_selector('table > tbody > tr > td.td-tree-name', text: 'ツリー2')
      end

      it '削除の実行が完了すると、削除完了メッセージが表示されること' do
        find('table > tbody > tr > td.td-tree-name > a', text: 'ツリー1').ancestor('tr').find('td.td-tree-action > label',
                                                                                              text: '削除').click
        click_button '削除する'
        expect(page).to have_content(I18n.t('messages.tree_destroyed', target_tree_name: 'ツリー1'))
      end

      it '削除を実行すると、ツリーが削除され、ツリーに紐づくノードとレイヤーも全て削除されていること' do
        create(:node, name: 'ルート', tree_id: tree1.id)
        create(:node, name: '子1', tree_id: tree1.id, parent_id: Node.first.id)
        create(:node, name: '子2', tree_id: tree1.id, parent_id: Node.first.id)
        create(:layer, tree_id: tree1.id)
        visit root_path
        expect(Tree.where(user_id: user.id).count).to eq(2)
        expect(Node.where(tree_id: tree1.id).count).to eq(3)
        expect(Layer.where(tree_id: tree1.id).count).to eq(1)
        find('table > tbody > tr > td.td-tree-name > a', text: 'ツリー1').ancestor('tr').find('td.td-tree-action > label',
                                                                                              text: '削除').click
        click_button '削除する'
        expect(Tree.where(user_id: user.id).count).to eq(1)
        expect(Node.where(tree_id: tree1.id).count).to eq(0)
        expect(Layer.where(tree_id: tree1.id).count).to eq(0)
      end
    end

    context 'ツリーが1件のとき' do
      it 'ツリーの削除を実行したあと、ツリーが0件になったときは、ツリー一覧が表示されず、ツリー作成ボタンが表示されること' do
        create(:tree, name: '1件だけのツリー', user_id: user.id)
        visit root_path
        page.all('table > tbody > tr > td.td-tree-action > label', text: '削除').first.click
        click_button '削除する'
        expect(page).to have_content(I18n.t('messages.tree_destroyed', target_tree_name: '1件だけのツリー'))
        expect(page).to have_content('まだツリーがありません。')
        expect(page).to have_button('ツリーを作成する')
        expect(page).not_to have_table
      end
    end

    context '削除対象のツリーが存在しないとき' do
      it '404エラーページが表示されること' do
        tree = create(:tree, name: '削除されるツリー', user_id: user.id)
        visit root_path
        find('table > tbody > tr > td.td-tree-name > a', text: '削除されるツリー').ancestor('tr').find(
          'td.td-tree-action > label', text: '削除'
        ).click
        tree.destroy!
        click_button '削除する'
        expect(page).to have_content('404')
      end
    end
  end
end
