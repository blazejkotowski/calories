class MealPolicy < ApplicationPolicy
  %w(update? show? destroy? create?).each do |method|
    define_method method do
      user.instance_of?(User) && (user.admin? || record.user_id == user.id)
    end
  end
end