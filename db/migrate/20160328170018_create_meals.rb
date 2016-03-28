class CreateMeals < ActiveRecord::Migration
  def change
    create_table :meals do |t|
      t.string :description
      t.integer :calories_number
      t.date :consumption_date
      t.time :consumption_time
      t.belongs_to :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
