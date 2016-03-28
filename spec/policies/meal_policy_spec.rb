require 'rails_helper'

describe MealPolicy do
  subject { described_class }

  let(:owner) { create(:user, admin: false) }
  let(:other_user) { create(:user, email: 'other@example.com', admin: false) }
  let(:admin) { create(:user, email: 'admin@example.com', admin: true) }
  let(:meal) { create(:meal, user: owner) }

  permissions :show?, :update?, :destroy?, :create? do
    it "grants access to owner" do
      expect(subject).to permit(owner, meal)
    end
    it "grants access to admin" do
      expect(subject).to permit(admin, meal)
    end
    it "denies access to other user" do
      expect(subject).not_to permit(other_user, meal)
    end
    it "denies access to not authenticated" do
      expect(subject).not_to permit(nil, meal)
    end
  end

end