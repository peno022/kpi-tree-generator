# frozen_string_literal: true

FactoryBot.define do
  factory :tree do
    name { 'My first tree' }
    user
  end
end
