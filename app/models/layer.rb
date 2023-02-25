# frozen_string_literal: true

class Layer < ApplicationRecord
  enum :operation, { 'かけ算': 0, 'たし算': 1 }
  belongs_to :parent_node, class_name: 'Node'
  validates :operation, presence: true
  validates :fraction, numericality: true, allow_nil: true
end
