# frozen_string_literal: true

class AddProviderToUser < ActiveRecord::Migration[7.0]
  def change
    change_table :users do |t|
      t.string :provider, null: false, default: 'google_oauth2'
    end
  end
end
