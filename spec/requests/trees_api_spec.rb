# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'TreesApi' do
  describe 'GET /api/trees/:id' do
    context 'ログインしていないとき' do
      it '401エラーを返すこと' do
        tree = create(:tree)
        get "/api/trees/#{tree.id}.json"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済みのとき' do
      let(:user) { User.find_or_create_from_auth_hash(OmniAuth.config.mock_auth[:google_oauth2]) }

      before do
        get '/auth/google_oauth2/callback'
      end

      it 'ログイン済みで、存在しないツリー（ID=0）の場合は404エラーを返すこと' do
        get '/api/trees/0.json'
        expect(response).to have_http_status(:not_found)
      end

      it 'ログインユーザーのツリーでない場合は404エラーを返すこと' do
        tree = create(:tree)
        get "/api/trees/#{tree.id}.json"
        expect(response).to have_http_status(:not_found)
      end

      it 'ログインユーザーのツリーの情報を返すこと' do
        tree = create(:tree, user_id: user.id)
        get "/api/trees/#{tree.id}.json"
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
