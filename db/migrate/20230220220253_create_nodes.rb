# frozen_string_literal: true

class CreateNodes < ActiveRecord::Migration[7.0]
  def change
    create_table :nodes do |t|
      t.string :name
      t.float :value
      t.integer :value_format
      t.integer :unit
      t.boolean :is_value_locked
      t.references :tree, null: false, foreign_key: true
      t.references :parent, foreign_key: { to_table: :nodes }
      t.references :layer, foreign_key: true

      t.timestamps
    end
  end
end
