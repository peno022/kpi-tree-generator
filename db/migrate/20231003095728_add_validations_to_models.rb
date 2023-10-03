# frozen_string_literal: true

class AddValidationsToModels < ActiveRecord::Migration[7.0]
  def up
    change_table :nodes, bulk: true do |t|
      t.change :name, :string, limit: 15
      t.change :unit, :string, limit: 10
    end
    change_column :trees, :name, :string, limit: 50
  end

  def down
    change_table :nodes, bulk: true do |t|
      t.change :name, :string, limit: nil
      t.change :unit, :string, limit: nil
    end
    change_column :trees, :name, :string, limit: nil
  end
end
