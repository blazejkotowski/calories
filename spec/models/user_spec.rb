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
    subject.expected_calories = -10
    expect(subject).not_to be_valid
  end

  it "validates the format of name" do
    subject.name = "!Wrong Name"
    expect(subject).not_to be_valid
  end

  it "validates the uniqueness of e-mail" do
    create(:user)
    subject.valid?
    expect(subject.errors.messages.try(:[], :email)).not_to be_empty
  end

  it "validates the length of password" do
    subject.password = subject.password_confirmation = 'short'
    expect(subject).not_to be_valid
  end

  it "authenticates with correct password" do
    password = subject.password
    subject.save

    expect(subject.authenticate(password)).not_to be false
  end

  it "doesn't authenticate with wrong password" do
    wrong_password = subject.password*2
    subject.save

    expect(subject.authenticate(wrong_password)).to be false
  end
end
