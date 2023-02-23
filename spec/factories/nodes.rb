# frozen_string_literal: true

FactoryBot.define do
  factory :node do
    name { 'My node' }
    value { 1.5 }
    value_format { 0 }
    unit { '円' }
    is_value_locked { false }
    tree
  end
end
