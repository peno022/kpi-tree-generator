# frozen_string_literal: true

class CreateLayers < ActiveRecord::Migration[7.0]
  def change
    create_table :layers do |t|
      t.integer :operation
      t.float :fraction

      t.timestamps
    end
  end
end
