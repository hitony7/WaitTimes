class AddPatientName < ActiveRecord::Migration[5.2]
  def up
    add_column :patients, :name, :string
  end
  def down
    remove_column :patients, :name
  end
end
