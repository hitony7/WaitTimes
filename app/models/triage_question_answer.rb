class TriageQuestionAnswer < ApplicationRecord
  belongs_to :triage_question, foreign_key: :triage_questions_id
end
