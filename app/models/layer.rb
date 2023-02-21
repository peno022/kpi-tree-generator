# frozen_string_literal: true

class Layer < ApplicationRecord
  enum :operation, { 'かけ算': 0, 'たし算': 1 }

  has_many :nodes, dependent: :destroy
  validates_associated :nodes
  validates :fraction, numericality: true, allow_nil: true
end
