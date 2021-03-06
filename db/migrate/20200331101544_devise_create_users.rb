# frozen_string_literal: true

class DeviseCreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :nickname,            null: false
      t.string :email,               null: false, default: ""
      t.string :encrypted_password,  null: false, default: ""
      t.string :last_name,           null: false
      t.string :first_name,          null: false
      t.string :last_name_kana,      null: false
      t.string :first_name_kana,     null: false
      t.string :birth_year,          null: false
      t.string :birth_month,         null: false
      t.string :birth_day,           null: false
      t.string :postcode,            null: false
      t.string :prefecture,          null: false
      t.string :city,                null: false
      t.string :block,               null: false
      t.string :phone_number
      t.string :image
      
      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at
      t.datetime :remember_created_at
      t.timestamps null: false
    end

    add_index :users, :nickname,             unique: true
    add_index :users, :email,                unique: true
    # add_index :users, :reset_password_token, unique: true
    # add_index :users, :confirmation_token,   unique: true
    # add_index :users, :unlock_token,         unique: true
  end
end
