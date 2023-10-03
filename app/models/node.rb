# frozen_string_literal: true

class Node < ApplicationRecord
  enum :value_format, { 'なし': 0, '%': 1, '千': 2, '万': 3 }

  belongs_to :tree
  belongs_to :parent, class_name: 'Node', optional: true, inverse_of: :children
  has_one :child_layer, class_name: 'Layer', foreign_key: 'parent_node_id', dependent: :destroy,
                        inverse_of: :parent_node
  has_many :children, class_name: 'Node', foreign_key: 'parent_id', dependent: :destroy, inverse_of: :parent

  validates :name, presence: true, length: { maximum: 15 }
  validates :value, presence: true, numericality: { less_than_or_equal_to: 999_999_999 }
  validates :value_format, presence: true
  validates :unit, length: { maximum: 10 }
  validates :unit, absence: true, if: :percent_formatted?

  def percent_formatted?
    value_format == '%'
  end
end
