# frozen_string_literal: true

class CreateTriageQuestions < ActiveRecord::Migration[5.2]
  def change
    create_table :triage_questions do |t|
      t.string   :question_text
    end
  end
end
