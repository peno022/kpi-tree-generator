# frozen_string_literal: true

FactoryBot.define do
  factory :node do
    name { 'MyString' }
    value { 1.5 }
    value_format { 1 }
    unit { 1 }
    is_value_locked { false }
    operation_ratio_denominator { 1 }
    operation_ratio_numerator { 1 }
    tree { nil }
  end
end
