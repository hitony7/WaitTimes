class CreateEmergencyRooms < ActiveRecord::Migration[5.2]
  def change
    create_table :emergency_rooms do |t|

      t.string   :hospital_name
      t.string   :address
    end
  end
end
