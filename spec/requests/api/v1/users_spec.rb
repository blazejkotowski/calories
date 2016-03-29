require 'rails_helper'
require_relative "./api_config.rb"

describe "Users API" do
  include_context 'api config'

  let(:base_url) { "#{base_api_url}/users" }
  let :valid_user_params do
    { 
      user: 
      { 
        name: "New User", 
        email: "new_user@example.com", 
        password: "pass123", 
        password_confirmation: "pass123" 
      } 
    }
  end

  shared_examples "the same user" do
    it "shows the user" do
      get "#{base_url}/#{@user.id}", nil, auth_headers
      expect(response).to have_http_status(:ok)
      expect(json['user']['email']).to eq(@user.email)
    end

    it "updates the user" do
      params = { user: { name: 'New Name' } }
      put "#{base_url}/#{@user.id}", params, auth_headers
      expect(response).to have_http_status(:no_content)
      @user.reload
      expect(@user.name).to eq('New Name')
    end
  end

  context "accessed by admin" do
    let(:current_user) { @admin }
    
    it_should_behave_like "the same user"

    it "destroys the user" do
      expect {
        delete "#{base_url}/#{@user.id}", nil, auth_headers
      }.to change{ User.count }.by(-1)
      expect(response).to have_http_status(:no_content)
    end

    it "retrieves users list" do
      get base_url, nil, auth_headers
      expect(response).to have_http_status(:ok)
      expect(json).not_to be_empty
    end

    it "creates new user" do
      expect {
        post base_url, valid_user_params, auth_headers
      }.to change{ User.count }.by(1)
      expect(response).to have_http_status(:created)
      expect(json['user']).not_to be_nil
    end
  end

  context "accessed by the same user" do
    let(:current_user) { @user }
    
    it_should_behave_like "the same user"

    it "doesn't retrieve users list" do
      get base_url, nil, auth_headers
      expect(response).to have_http_status(:forbidden)
    end
  end

  context "accessed by other user" do
    let(:current_user) { @other_user }
    
    it "doesn't show the user" do
      get "#{base_url}/#{@user.id}", nil, auth_headers
      expect(response).to have_http_status(:forbidden)
    end

    it "doesn't update the user" do
      params = { user: { name: 'New Name' } }
      put "#{base_url}/#{@user.id}", params, auth_headers
      expect(response).to have_http_status(:forbidden)
      @user.reload
      expect(@user.name).not_to be('New Name')
    end

    it "doesn't destroy the user" do
      expect { 
        delete "#{base_url}/#{@user.id}", nil, auth_headers
      }.not_to change{ User.count }
      expect(response).to have_http_status(:forbidden)
    end

    it "doesn't retrieve users list" do
      get base_url, nil, auth_headers
      expect(response).to have_http_status(:forbidden)
    end
  end

  context "accessed by not authenticated user" do
    let(:current_user) { @user }

    it "doesn't show the user" do
      get "#{base_url}/#{@user.id}", nil
      expect(response).to have_http_status(:unauthorized)
    end

    it "doesn't update the user" do
      params = { user: { name: "New Name" } }
      put "#{base_url}/#{@user.id}", params
      expect(response).to have_http_status(:unauthorized)
      @user.reload
      expect(@user.name).not_to be('New Name')
    end

    it "doesn't destroy the user" do
      expect {
        delete "#{base_url}/#{@user.id}", nil
      }.not_to change{ User.count }
      expect(response).to have_http_status(:unauthorized)
    end

    it "doesn't retrieve users list" do
      get base_url, nil
      expect(response).to have_http_status(:unauthorized)
    end

    it "creates new user" do
      expect {
        post base_url, valid_user_params
      }.to change{ User.count }.by(1)
      expect(response).to have_http_status(:created)
      expect(json['user']).not_to be_nil
    end

    it "doesn't create invalid user" do
      invalid_user_params = valid_user_params.clone
      invalid_user_params[:user][:name] = "!Invalid Name"

      expect {
        post base_url, invalid_user_params
      }.not_to change{ User.count }
      expect(response).to have_http_status(:bad_request)
      expect(json['errors']).not_to be_empty
    end
  end

end
  