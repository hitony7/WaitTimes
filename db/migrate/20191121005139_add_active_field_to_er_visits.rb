class AddActiveFieldToErVisits < ActiveRecord::Migration[5.2]
  def up
    add_column :emergency_room_visits, :is_active, :boolean, default: true
  end

  def down
    remove_column :emergency_room_visits, :is_active
  end
end
