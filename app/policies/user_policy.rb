class UserPolicy < ApplicationPolicy

  %w(index? destroy?).each do |method|
    define_method method do
      user.instance_of?(User) && user.admin?
    end
  end

  %w(update? show? index_meals?).each do |method|
    define_method method do
      user.instance_of?(User) && (user.admin? || record.id == user.id)
    end
  end

  def create?
    user.nil? || user.admin?
  end
end