class AddPatientIdToErVisitTable < ActiveRecord::Migration[5.2]
  def change
    add_reference :emergency_room_visits, :patients, foreign_key: true # adds patients_id to emergency_room_visits table
  end
end
