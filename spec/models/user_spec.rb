# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User do
  it 'uniqueなproviderとuidがあれば有効な状態である' do
    user = described_class.new(
      provider: 'google_oauth2',
      uid: '1234567890'
    )
    expect(user).to be_valid
  end

  it 'uidがnilだと無効になる' do
    user = described_class.new(uid: nil)
    user.valid?
    expect(user.errors[:uid]).to include("can't be blank")
  end

  it 'providerにはデフォルトで"google_oauth2"を設定する' do
    user = described_class.new(uid: '1234567890')
    expect(user.provider).to eq('google_oauth2')
  end

  it 'find_or_create_from_auth_hashメソッドでユーザーを作成する' do
    auth_hash = {
      provider: 'google_oauth2',
      uid: '100000000000000000000',
      info: {
        name: 'John Smith',
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Smith',
        image: 'https://lh4.googleusercontent.com/photo.jpg',
        urls: {
          google: 'https://plus.google.com/+JohnSmith'
        }
      }
    }
    result = described_class.find_or_create_from_auth_hash(auth_hash)

    expect(result).to be_a(described_class)
    expect(result.provider).to eq(auth_hash[:provider])
    expect(result.uid).to eq(auth_hash[:uid])
    expect(result.name).to eq(auth_hash[:info][:name])
  end
end
