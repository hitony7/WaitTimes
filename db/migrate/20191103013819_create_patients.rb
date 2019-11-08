# frozen_string_literal: true

class CreatePatients < ActiveRecord::Migration[5.2]
  def change
    create_table :patients do |t|
      t.integer :ahc_number
      t.string :address
      t.integer :age

      t.timestamps null: false
    end
  end
end
