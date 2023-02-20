# frozen_string_literal: true

class Layer < ApplicationRecord
  has_many :nodes, dependent: :destroy
end
