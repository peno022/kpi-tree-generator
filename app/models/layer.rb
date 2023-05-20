# frozen_string_literal: true

class Layer < ApplicationRecord
  enum :operation, { multiply: 0, add: 1 }
  belongs_to :parent_node, class_name: 'Node'
  belongs_to :tree
  validates :operation, presence: true
  validates :fraction, numericality: true, allow_nil: true
end
