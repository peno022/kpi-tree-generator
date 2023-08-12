# frozen_string_literal: true

FactoryBot.define do
  factory :layer do
    operation { 'multiply' }
    fraction { 0 }
    parent_node { association :node }
    tree
  end
end
