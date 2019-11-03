class CreateTriageQuestionAnswers < ActiveRecord::Migration[5.2]
  def change
    create_table :triage_question_answers do |t|

      t.string   :answer_text
    end
  end
end
