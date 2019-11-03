# frozen_string_literal: true

class CreateEmergencyRoomVisits < ActiveRecord::Migration[5.2]
  def change
    create_table :emergency_room_visits do |t|
      t.string   :visit_description
      t.integer  :given_wait_time_minutes
      t.timestamps
    end
  end
end
