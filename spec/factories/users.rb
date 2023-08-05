# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    provider { 'google_oauth2' }
    sequence(:uid) { |n| "000000#{n}" }
  end
end
