class EmergencyRoomVisit < ApplicationRecord
  belongs_to :user, foreign_key: :users_id
  belongs_to :patient, foreign_key: :patients_id
  validates :visit_description, presence: true
  validates :user, presence: true
end
