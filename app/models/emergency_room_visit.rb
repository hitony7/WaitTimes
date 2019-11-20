class EmergencyRoomVisit < ApplicationRecord
  belongs_to :user, foreign_key: :users_id
  validates :visit_description, presence: true
  validates :user, presence: true
end
