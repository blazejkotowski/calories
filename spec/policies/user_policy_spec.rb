require 'rails_helper'

describe UserPolicy do
  subject { described_class }

  let(:accessed_user) { create(:user, admin: false) }
  let(:admin) { create(:user, email: 'admin@example.com', admin: true ) }
  let(:other_user) { create(:user, email: 'other@example.com', admin: false ) }

  permissions :update?, :show?, :index_meals? do
    it "grants access if current user is admin" do
      expect(subject).to permit(admin, accessed_user)
    end
    it "grants access if current user is the same" do
      expect(subject).to permit(accessed_user, accessed_user)
    end
    it "denies access if current user is other" do
      expect(subject).not_to permit(other_user, accessed_user)
    end
    it "denies access if current user is not authenticated" do
      expect(subject).not_to permit(nil, accessed_user)
    end
  end

  permissions :index?, :destroy? do
    it "grants access if user is admin" do
      expect(subject).to permit(admin, nil)
    end
    it "denies access in any other case" do
      expect(subject).not_to permit(nil, nil)
      expect(subject).not_to permit(other_user, nil)
    end
  end

  permissions :create? do 
    it "denies access if current user is authenticated" do
      expect(subject).not_to permit(other_user, nil)
    end
    it "grants access is current user is not authenticated" do
      expect(subject).to permit(nil, nil)
    end
  end
end