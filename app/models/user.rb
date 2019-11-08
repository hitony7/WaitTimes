# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  # Create a bcrypt hashed version of a plain text password
  def hash_password # We'll call this method in the seed file; from https://gist.github.com/mdang/7b6097cc13b07db82c78
    if password.present?
      self.password_digest = BCrypt::Password.create(password)
    end
  end
end
