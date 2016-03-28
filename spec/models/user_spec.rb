require 'rails_helper'

describe User do
  it "has a valid factory" do
    expect(build(:user)).to be_valid
  end
  
  it "is invalid without email" do
    expect(build(:user, email: nil)).not_to be_valid
  end

  it "is invalid without name" do
    expect(build(:user, name: nil)).not_to be_valid
  end
  
  it "is invalid without password" do
    expect(build(:user, password: nil, password_confirmation: nil)).not_to be_valid
  end

  it "is invalid with negative expected calories" do
    expect(build(:user, expected_calories: -10)).not_to be_valid
  end

  it "validates the name" do
    expect(build(:user, name: '!Wrong Name')).not_to be_valid
  end

  it "validates the uniqueness of e-mail" do
    create(:user)
    user = build(:user)
    user.valid?
    expect(user.errors.messages.try(:[], :email)).not_to be_empty
  end
end
