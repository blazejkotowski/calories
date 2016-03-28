class AddExpectedCaloriesToUsers < ActiveRecord::Migration
  def change
    add_column :users, :expected_calories, :integer
  end
end
