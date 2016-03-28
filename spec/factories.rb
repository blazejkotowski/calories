FactoryGirl.define do
  factory :user do
    email  'user@example.com'
    password 'pass123'
    password_confirmation 'pass123'
    expected_calories 2000
    name 'John Smith'
  end
end