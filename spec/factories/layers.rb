# frozen_string_literal: true

FactoryBot.define do
  factory :layer do
    operation { 'multiply' }
    parent_node { association :node }
    tree
  end
end
