class ChangePatientToRefUser < ActiveRecord::Migration[5.2]
  def up
    remove_reference :patients, :emergency_room_visits, foreign_key: true # removes emergency_room_visits_id to patients table
    add_reference :patients, :users, foreign_key: true # adds users_id (caregiver) to patients table
  end

  def down
    add_reference :patients, :emergency_room_visits, foreign_key: true # removes emergency_room_visits_id to patients table
    remove_reference :patients, :users, foreign_key: true # adds users_id (caregiver) to patients table
  end
end
