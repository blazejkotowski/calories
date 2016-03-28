require 'rails_helper'

describe User do

  subject { build(:user) }

  it "has a valid factory" do
    expect(subject).to be_valid
  end
  
  it "is invalid without email" do
    subject.email = nil
    expect(subject).not_to be_valid
  end

  it "is invalid without name" do
    subject.name = nil
    expect(subject).not_to be_valid
  end
  
  it "is invalid without password" do
    subject.password = subject.password_confirmation = nil
    expect(subject).not_to be_valid
  end

  it "is invalid with negative expected calories" do
    sybhect.expected_calories = -10
    expect(subject).not_to be_valid
  end

  it "validates the name" do
    subject.name = "!Wrong Name"
    expect(subject).not_to be_valid
  end

  it "validates the uniqueness of e-mail" do
    create(:user)
    subject.valid?
    expect(subject.errors.messages.try(:[], :email)).not_to be_empty
  end

  it "authenticates with correct password" do
  end
  it "doesn't authenticate with wrong password"
end
