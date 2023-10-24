# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SessionsHelper, type: :helper do
  let(:user) { create(:user) }

  describe '#current_user' do
    context 'session[:user_id]が存在するとき' do
      before do
        session[:user_id] = user.id
      end

      it '現在のユーザーを返す' do
        expect(current_user).to eq(user)
      end
    end

    context 'session[:user_id]が存在しないとき' do
      it 'nilを返す' do
        expect(current_user).to be_nil
      end
    end
  end

  describe '#log_in' do
    before do
      log_in(user)
    end

    it 'session[:user_id]にユーザーのIDを設定する' do
      expect(session[:user_id]).to eq(user.id)
    end
  end

  describe '#log_out' do
    before do
      session[:user_id] = user.id
      log_out
    end

    it 'sessionからuser_idを削除する' do
      expect(session[:user_id]).to be_nil
    end
  end
end
