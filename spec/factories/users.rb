# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    provider { 'google_oauth2' }
    sequence(:uid, &:to_s)
  end
end
