# frozen_string_literal: true

class Tree < ApplicationRecord
  belongs_to :user
  has_many :nodes, dependent: :destroy
  has_many :layers, dependent: :destroy
  validates :name, presence: true
end
