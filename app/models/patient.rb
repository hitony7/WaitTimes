class Patient < ApplicationRecord
  belongs_to :user, foreign_key: :users_id
  validates :ahc_number, presence: true, numericality: true
  validates :address, presence: true
  validates :age, presence: true, numericality: true
  validates :name, presence: true
  validates :user, presence: true
end
