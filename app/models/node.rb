# frozen_string_literal: true

class Node < ApplicationRecord
  belongs_to :tree
  belongs_to :parent, class_name: 'Node', optional: true
end
