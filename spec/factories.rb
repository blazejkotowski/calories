FactoryGirl.define do
  factory :user do
    email  'user@example.com'
    password 'pass123'
    password_confirmation 'pass123'
    expected_calories 2000
    name 'John Smith'
  end

  factory :meal do
    description "200 Calories meal"
    calories_number 200
    consumption_date "2016-03-28"
    consumption_time "19:00:18"
  end
end