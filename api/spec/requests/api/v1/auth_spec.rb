require 'rails_helper'

describe "Auth API" do
  let(:user) { build(:user) }

  it "authenticates user with correct credentials" do
    correct_password = user.password
    user.save

    post '/api/v1/authenticate', { email: user.email, password: correct_password }
    expect(response).to be_success

    expect(AuthToken.decode(json['auth_token'])).to include({ user_id: user.id })
    expect(json['user']['id']).to be user.id
  end

  it "doesn't authenticate with wrong credentials" do
    wrong_password = user.password * 2
    user.save

    post '/api/v1/authenticate', { email: user.email, password: wrong_password }

    expect(response).to have_http_status :unauthorized
    expect(json['errors']).not_to be_empty
  end

  it "doesn't authenticate non existent user" do
    post "/api/v1/authenticate", { email: "wrong email", password: "random" }

    expect(response).to have_http_status :unauthorized
    expect(json['errors']).not_to be_empty
  end
end