class Meal < ActiveRecord::Base
  validates_presence_of :consumption_date, :consumption_time, :calories_number, 
                        :description, :user_id
  validates :calories_number, numericality: { greater_than_or_equal_to: 0 }
  
  belongs_to :user
end
