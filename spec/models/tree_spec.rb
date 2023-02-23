# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Tree do
  it 'userとnameがあれば有効な状態である' do
    tree = described_class.new(
      name: 'My first tree',
      user: create(:user)
    )
    expect(tree).to be_valid
  end

  it '参照するuserがnilだと無効になる' do
    tree = described_class.new(user: nil)
    tree.valid?
    expect(tree.errors[:user]).to include('must exist')
  end

  it '存在しないuser_idが設定されると無効になる' do
    tree = described_class.new(user_id: User.maximum(:id).to_i + 1)
    tree.valid?
    expect(tree.errors[:user]).to include('must exist')
  end

  it 'nameがないと無効になる' do
    tree = described_class.new(name: nil)
    tree.valid?
    expect(tree.errors[:name]).to include("can't be blank")
  end
end
