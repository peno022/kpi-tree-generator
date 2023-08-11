# frozen_string_literal: true

class AddColumnsForSigninToUsers < ActiveRecord::Migration[7.0]
  def change
    change_table :users, bulk: true do |t|
      t.string :uid
      t.string :name
      t.string :email
      t.string :image
    end
  end
end
