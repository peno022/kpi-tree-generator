# frozen_string_literal: true

class Layer < ApplicationRecord
  enum :operation, { multiply: 0, add: 1 }
  belongs_to :parent_node, class_name: 'Node'
  belongs_to :tree
  validates :operation, presence: true
  validates :fraction, numericality: { less_than_or_equal_to: 999_999_999 }
end
