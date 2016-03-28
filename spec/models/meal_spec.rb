require 'rails_helper'

describe Meal do
  let(:user) { create(:user) }
  subject { build(:meal, user: user) }

  it "has a valid factory" do
    expect(subject).to be_valid
  end

  it "is invalid without consumption_date" do
    subject.consumption_date = nil
    expect(subject).not_to be_valid
  end

  it "is invalid without consumption_time" do
    subject.consumption_time = nil
    expect(subject).not_to be_valid
  end

  it "is invalid without calories_number" do
    subject.calories_number = nil
    expect(subject).not_to be_valid
  end

  it "is invalid with negative calories_number" do
    subject.calories_number = -100
    expect(subject).not_to be_valid
  end

  it "is invalid without descripton" do
    subject.description = nil
    expect(subject).not_to be_valid
  end

  it "is invalid without user" do
    subject.user = nil
    expect(subject).not_to be_valid
  end

end
