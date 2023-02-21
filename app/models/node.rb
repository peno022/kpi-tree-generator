# frozen_string_literal: true

class Node < ApplicationRecord
  enum :value_format, { 'なし': 0, '%': 1, '千': 2, '万': 3 }

  belongs_to :tree
  belongs_to :layer
  belongs_to :parent, class_name: 'Node', optional: true
  has_many :children, class_name: 'Node', foreign_key: 'parent_id', dependent: :destroy, inverse_of: :parent

  validates :name, presence: true
  validates :value, presence: true, numericality: true
  validates :value_format, presence: true # memo:enumで定義していない値を渡すと、RailsのArgumentErroｒになる
  validates :unit, absence: true, if: :percent_formatted?
  validates :is_value_locked, presence: true

  def percent_formatted?
    value_format == '%'
  end
end
