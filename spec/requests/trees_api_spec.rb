# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'TreesApi' do
  describe 'ログインしていないとき' do
    it 'GET /api/trees/:id は401エラーを返すこと' do
      tree = create(:tree)
      get "/api/trees/#{tree.id}.json"
      expect(response).to have_http_status(:unauthorized)
    end

    it 'PUT /api/trees/:id は401エラーを返すこと' do
      tree = create(:tree)
      put "/api/trees/#{tree.id}.json", params: { tree: { nodes: [], layers: [] } }
      expect(response).to have_http_status(:unauthorized)
    end

    it 'PATCH /api/trees/:id/update_name は401エラーを返すこと' do
      tree = create(:tree)
      patch "/api/trees/#{tree.id}/update_name.json", params: { name: 'new name' }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'GET /api/trees/:id' do
    let!(:user) { User.find_or_create_from_auth_hash(OmniAuth.config.mock_auth[:google_oauth2]) }

    before do
      get '/auth/google_oauth2/callback'
    end

    describe '異常系' do
      it 'ログイン済みで、存在しないツリー（ID=0）の場合は404エラーを返すこと' do
        get '/api/trees/0.json'
        expect(response).to have_http_status(:not_found)
      end

      it 'ログインユーザーのツリーでない場合は404エラーを返すこと' do
        tree = create(:tree)
        get "/api/trees/#{tree.id}.json"
        expect(response).to have_http_status(:not_found)
      end
    end

    describe '正常系' do
      it 'ログインユーザーのツリーの情報を返すこと' do
        tree = create(:tree, user_id: user.id)
        get "/api/trees/#{tree.id}.json"
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe 'PUT /api/trees/:id' do
    let!(:user) { User.find_or_create_from_auth_hash(OmniAuth.config.mock_auth[:google_oauth2]) }

    before do
      get '/auth/google_oauth2/callback'
    end

    describe '異常系' do
      it 'ログイン済みで、存在しないツリー（ID=0）の場合は404エラーを返すこと' do
        put '/api/trees/0.json', params: { tree: { nodes: [], layers: [] } }
        expect(response).to have_http_status(:not_found)
      end

      it 'ログインユーザーのツリーでない場合は404エラーを返すこと' do
        tree = create(:tree)
        put "/api/trees/#{tree.id}.json", params: { tree: { nodes: [], layers: [] } }
        expect(response).to have_http_status(:not_found)
      end

      it '不正なパラメータを送信した場合、422エラーを返すこと' do
        tree = create(:tree, user_id: user.id)
        root = create(:node, tree_id: tree.id, parent_id: nil)
        invalid_data = { tree: { nodes: [{
          id: root.id,
          name: nil, # 不正なパラメータ
          value: 1000,
          value_format: '万',
          unit: '円',
          is_value_locked: true,
          tree_id: tree.id,
          parent_id: nil
        }], layers: [] } }
        put "/api/trees/#{tree.id}.json", params: invalid_data
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['errors']).to eq(["Name can't be blank"])
      end
    end

    describe '正常系' do
      let!(:tree) { create(:tree, user_id: user.id) }
      let!(:root) { create(:node, tree_id: tree.id, parent_id: nil) }
      let!(:child1) { create(:node, tree_id: tree.id, parent_id: root.id) }
      let!(:child2) { create(:node, tree_id: tree.id, parent_id: root.id) }
      let!(:children_layer) { create(:layer, tree_id: tree.id, parent_node_id: root.id) }
      let!(:body_data) do
        { tree: { nodes: [{
          id: root.id,
          name: 'ルート',
          value: 1000,
          value_format: '万',
          unit: '円',
          is_value_locked: true,
          tree_id: tree.id,
          parent_id: nil
        }, {
          id: child1.id,
          name: '子1',
          value: 10_000,
          value_format: 'なし',
          unit: '人',
          is_value_locked: false,
          tree_id: tree.id,
          parent_id: root.id
        }, {
          id: child2.id,
          name: '子2',
          value: 1000,
          value_format: 'なし',
          unit: '円',
          is_value_locked: true,
          tree_id: tree.id,
          parent_id: root.id
        }], layers: [
          {
            id: children_layer.id,
            operation: 'multiply',
            fraction: 0,
            parent_node_id: root.id,
            tree_id: tree.id
          }
        ] } }
      end

      it 'ログインユーザーのツリーの情報を更新すること' do
        put "/api/trees/#{tree.id}.json", params: body_data
        expected = {
          'tree' => { 'id' => tree.id, 'name' => tree.name, 'user_id' => tree.user_id },
          'nodes' => body_data[:tree][:nodes].map do |node|
            node.transform_keys(&:to_s).tap do |n|
              n['value'] = n['value'].to_f if n.key?('value')
            end
          end,
          'layers' => body_data[:tree][:layers].map do |layer|
            layer.transform_keys(&:to_s).tap do |l|
              l['fraction'] = l['fraction'].to_f if l.key?('fraction')
            end
          end
        }
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq(expected)
        expect(tree.nodes.count).to eq(3)
        expect(tree.layers.count).to eq(1)
      end

      it 'ツリーに新規ノード・階層を追加できること' do
        expect(tree.nodes.count).to eq(3)
        expect(tree.layers.count).to eq(1)

        new_grandchildren = [{
          name: '孫1-1',
          value: 2000,
          value_format: 'なし',
          unit: '人',
          is_value_locked: true,
          tree_id: tree.id,
          parent_id: child1.id
        }, {
          name: '孫1-2',
          value: 8000,
          value_format: 'なし',
          unit: '人',
          is_value_locked: false,
          tree_id: tree.id,
          parent_id: child1.id
        }]
        new_layer = {
          operation: 'add',
          fraction: 0,
          parent_node_id: child1.id,
          tree_id: tree.id
        }

        new_body_data = { tree: { nodes: body_data[:tree][:nodes] + new_grandchildren,
                                  layers: body_data[:tree][:layers] + [new_layer] } }
        put "/api/trees/#{tree.id}.json", params: new_body_data

        expect(response).to have_http_status(:ok)
        expect(tree.nodes.count).to eq(5)
        expect(tree.layers.count).to eq(2)
      end

      it 'ツリーのノード・階層を削除できること' do
        expect(tree.nodes.count).to eq(3)
        expect(tree.layers.count).to eq(1)

        new_body_data = { tree: { nodes: [body_data[:tree][:nodes][0]],
                                  layers: [body_data[:tree][:layer]] } }
        put "/api/trees/#{tree.id}.json", params: new_body_data

        expect(response).to have_http_status(:ok)
        expect(tree.nodes.count).to eq(1)
        expect(tree.layers.count).to eq(0)
      end
    end
  end

  describe 'PATCH /api/trees/:id/update_name' do
    let!(:user) { User.find_or_create_from_auth_hash(OmniAuth.config.mock_auth[:google_oauth2]) }

    before do
      get '/auth/google_oauth2/callback'
    end

    it 'ログイン済みで、存在しないツリー（ID=0）の場合は404エラーを返すこと' do
      patch '/api/trees/0/update_name.json', params: { name: 'new name' }
      expect(response).to have_http_status(:not_found)
    end

    it 'ログインユーザーのツリーでない場合は404エラーを返すこと' do
      tree = create(:tree)
      patch "/api/trees/#{tree.id}.json", params: { name: 'new name' }
      expect(response).to have_http_status(:not_found)
    end

    it '不正なパラメータを送信した場合、422エラーを返すこと' do
      tree = create(:tree, user_id: user.id)
      patch "/api/trees/#{tree.id}/update_name.json", params: { name: nil }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(response.parsed_body['errors']).to eq("Name can't be blank")
    end

    it 'ログインユーザーのツリーの名前を更新すること' do
      tree = create(:tree, user_id: user.id)
      patch "/api/trees/#{tree.id}/update_name.json", params: { name: 'new name' }
      expect(response).to have_http_status(:ok)
      expect(response.parsed_body['name']).to eq('new name')
      expect(tree.reload.name).to eq('new name')
    end
  end
end
