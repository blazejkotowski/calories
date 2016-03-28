require 'rails_helper'

describe "Auth API" do
  let(:user) { build(:user) }

  it "authenticates user with correct credentials" do
    password = user.password
    user.save

    post '/api/v1/auth/authenticate', { email: user.email, password: password }
    expect(response).to be_success

    expect(json['auth_token']).not_to be_nil
    expect(json['user']).not_to be_nil
  end

  it "doesn't authenticate with wrong credentials" do
    wrong_password = user.password * 2
    user.save

    post '/api/v1/auth/authenticate', { email: user.email, password: wrong_password }

    expect(response).to have_status :unauthorized
  end
end