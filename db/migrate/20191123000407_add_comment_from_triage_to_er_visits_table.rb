class AddCommentFromTriageToErVisitsTable < ActiveRecord::Migration[5.2]
  def change
    add_column :emergency_room_visits, :triage_comment, :string
  end
end
