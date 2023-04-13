# frozen_string_literal: true

class CreateLayers < ActiveRecord::Migration[7.0]
  def change
    create_table :layers do |t|
      t.integer :operation
      t.float :fraction
      t.references :parent_node, foreign_key: { to_table: :nodes }
      t.references :tree, null: false, foreign_key: true

      t.timestamps
    end
  end
end
