# frozen_string_literal: true

class Tree < ApplicationRecord
  belongs_to :user
  has_many :nodes, dependent: :destroy, autosave: true
  has_many :layers, dependent: :destroy, autosave: true
  validates :name, presence: true
end
