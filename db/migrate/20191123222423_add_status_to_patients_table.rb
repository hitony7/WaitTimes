class AddStatusToPatientsTable < ActiveRecord::Migration[5.2]
  def change
    add_column :patients, :user_status, :string
  end
end