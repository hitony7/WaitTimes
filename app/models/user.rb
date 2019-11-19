# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :phone, presence: true
  validates :role, inclusion: { in: %w[caregiver triage_staff],
                                message: '%{value} is not a valid role' }
  validates :password,
            length: { minimum: 6 },
            if: -> { new_record? || !password.nil? }

  # Create a bcrypt hashed version of a plain text password
  def hash_password # We'll call this method in the seed file; from https://gist.github.com/mdang/7b6097cc13b07db82c78
    if password.present?
      self.password_digest = BCrypt::Password.create(password)
    end
  end
end
