# frozen_string_literal: true

class CreateNodes < ActiveRecord::Migration[7.0]
  def change
    create_table :nodes do |t|
      t.string :name
      t.float :value
      t.integer :value_format
      t.string :unit
      t.boolean :is_value_locked, default: false
      t.references :tree, null: false, foreign_key: true
      t.references :parent, foreign_key: { to_table: :nodes }

      t.timestamps
    end
  end
end
