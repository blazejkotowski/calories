require 'rails_helper'
require_relative "./api_config.rb"

describe "Users API" do
  include_context 'api config'

  let(:base_url) { "#{base_api_url}/users" }

  shared_examples "the same user" do
    it "shows the user" do
      get "#{base_url}/#{user.id}", nil, auth_headers
      expect(response).to have_http_status(:ok)
      expect(json['user']['email']).to be(user.email)
    end

    it "updates the user" do
      params = { user: { name: 'New Name' } }
      put "#{base_url}/#{user.id}", params, auth_headers
      expect(response).to have_http_status(:no_content)
      user.reload
      expect(user.name).to be('New Name')
    end

    it "doesn't create a new user" do
      new_user = build(:user, email: 'new_user@example.com')
      params = new_user.as_json(only: [:name, :email, :password, :password_confirmation], root: true)
      expect {
        post base_url, params, auth_headers
      }.not_to change{ User.count }
      expect(response).to have_http_status(:forbidden)
    end
  end

  context "accessed by admin" do
    let(:current_user) { admin }
    
    it_should_behave_like "the same user"

    it "destroys the user" do
      expect {
        delete "#{base_url}/#{user.id}", nil, :auth_headers
      }.to change{ User.count }.by(-1)
      expect(response).to have_http_status(:no_content)
    end

    it "retrieves users list" do
      get base_url, nil, auth_headers
      expect(response).to have_http_status(:ok)
      expect(json['users']).not_to be_empty
    end

    it "creates new user" do
      new_user = build(:user, email: 'new_user@example.com')
      params = new_user.as_json(only: [:name, :email, :password, :password_confirmation], root: true)
      expect {
        post base_url, params, auth_headers
      }.to change{ User.count }.by(1)
      expect(response).to have_http_status(:created)
    end
  end

  context "accessed by the same user" do
    let(:current_user) { user }
    
    it_should_behave_like "the same user"

    it "doesn't retrieve users list" do
      get base_url, nil, auth_headers
      expect(response).to have_http_status(:forbidden)
    end
  end

  context "accessed by other user" do
    let(:current_user) { other_user }
    
    it "doesn't show the user" do
      get "#{base_url}/#{user.id}", nil, auth_headers
      expect(response).to have_http_status(:forbidden)
    end

    it "doesn't update the user" do
      params = { user: { name: 'New Name' } }
      put "#{base_url}/#{user.id}", params, auth_headers
      expect(response).to have_http_status(:forbidden)
      user.reload
      expect(user.name).not_to be('New Name')
    end

    it "doesn't destroy the user" do
      expect { 
        delete "#{base_url}/#{user.id}", nil, auth_headers
      }.not_to change{ User.count }
      expect(response).to have_http_status(:forbidden)
    end

    it "doesn't retrieve users list" do
      get base_url, nil, auth_headers
      expect(response).to have_http_status(:forbidden)
    end
  end

  context "accessed by not authenticated user" do
    let(:current_user) { user }

    it "doesn't show the user" do
      get "#{base_url}/#{user.id}", nil
      expect(response).to have_http_status(:unauthorized)
    end

    it "doesn't update the user" do
      params = { user: { name: "New Name" } }
      put "#{base_url}/#{user.id}", params
      expect(response).to have_http_status(:unauthorized)
      user.reload
      expect(user.name).not_to be('New Name')
    end

    it "doesn't destroy the user" do
      expect {
        delete "#{base_url}/#{user.id}", nil
      }.not_to change{ User.count }
      expect(response).to have_http_status(:unauthorized)
    end

    it "doesn't retrieve users list" do
      get base_url, nil
      expect(response).to have_http_status(:unauthorized)
    end

    it "creates new user" do
      new_user = build(:user, email: "new_user@example.com")
      params = new_user.as_json(only: [:name, :email, :password, :password_confirmation], root: true)
      expect {
        post base_url, params
      }.to change{ User.count }.by(1)
      expect(response).to have_http_status(:created)
      expect(json['user']).not_to be_nil
    end

    it "doesn't create invalid user" do
      new_user = build(:user, email: "new_user@example.com", name: "!INvalid name")
      params = new_user.as_json(only: [:name, :email, :password, :password_confirmation], root: true)
      expect {
        post base_url, params
      }.not_to change{ User.count }
      expect(response).to have_http_status(:bad_request)
    end
  end

end
  