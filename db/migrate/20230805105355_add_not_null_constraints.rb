# frozen_string_literal: true

class AddNotNullConstraints < ActiveRecord::Migration[7.0]
  def change
    change_column_null :users, :uid, true

    add_index :users, %i[uid provider], unique: true
  end
end
