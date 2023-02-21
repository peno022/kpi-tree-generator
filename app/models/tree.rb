# frozen_string_literal: true

class Tree < ApplicationRecord
  belongs_to :user
  has_many :nodes, dependent: :destroy

  validates_associated :nodes
  validates :name, presence: true
end
