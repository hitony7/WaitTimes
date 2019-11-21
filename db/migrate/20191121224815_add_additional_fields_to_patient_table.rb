class AddAdditionalFieldsToPatientTable < ActiveRecord::Migration[5.2]
  def change
    add_column :patients, :allergies, :string
    add_column :patients, :gender, :string
    add_column :patients, :caregiver_relationship, :string
  end
end
