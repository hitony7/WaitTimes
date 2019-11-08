# frozen_string_literal: true

class AddForeignKeys < ActiveRecord::Migration[5.2]
  def change
    # Let's create all the foreign key references in a single file
    # From https://edgeapi.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/SchemaStatements.html#method-i-add_reference
    add_reference :patients, :emergency_room_visits, foreign_key: true # adds emergency_room_visits_id to patients table
    add_reference :triage_question_answers, :triage_questions, foreign_key: true
    add_reference :triage_question_answers, :emergency_room_visits, foreign_key: true
    add_reference :emergency_room_visits, :users, foreign_key: true
    add_reference :emergency_room_visits, :emergency_rooms, foreign_key: true
  end
end
