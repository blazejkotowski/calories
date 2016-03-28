class User < ActiveRecord::Base
  has_secure_password

  validates_presence_of :email, :name
  validates_uniqueness_of :email
  validates :expected_calories, numericality: { greater_than_or_equal_to: 0 }
  validates_format_of :name, with: /\A[^0-9`!@#\$%\^&*+_=]+\z/
  validates :password, length: { minimum: 6 }
end
