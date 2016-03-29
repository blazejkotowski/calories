require 'rails_helper'

describe "Meals API" do
  let(:base_url) { "/api/v1/users/#{user.id}/meals"}

  let(:user) { create(:user) }
  let(:other_user) { create(:user, email: 'other@example.com') }
  let(:admin) { create(:user, email: 'admin@example.com', admin: true) }
  let(:password) { build(:user).password }

  let!(:auth_headers) { auth_headers_hash(current_user.email, password) }

  before(:context) { clear_auth_token }

  shared_examples "the same user" do
    it "retrieves user's meals" do
      10.times { create(:meal, user: user) }

      get base_url, nil, auth_headers
      expect(response).to have_http_status(:ok)
      expect(json['meals'].length).to be(10)
    end

    it "creates new meal if valid" do
      meal = build(:meal)
      params = meal.as_json(only: [:description, :calories_number, :consumption_time, :consumption_date], root: true)

      expect { 
        post base_url, params, auth_headers 
      }.to change{ user.meals.count }.by(1) 
      expect(response).to have_http_status(:created)
    end

    it "doesn't create a new meal if invalid" do
      meal = build(:meal, calories_number: -10)
      params = meal.as_json(only: [:description, :calories_number, :consumption_time, :consumption_date], root: true)

      expect {
        post base_url, params, auth_headers
      }.not_to change{ user.meals.count }
      expect(json['errors']).not_to be_empty
      expect(response).to have_http_status(:bad_request)
    end

    it "updates user's meal" do
      meal = create(:meal, user: user)
      params = { meal: { description: 'new description' } }

      put "#{base_url}/#{meal.id}", params, auth_headers
      expect(response).to have_http_status(:no_content)
      meal.reload
      expect(meal.description).to eq('new description')
    end

    it "destroys user's meal" do
      meal = create(:meal, user: user)

      expect { 
        delete "#{base_url}/#{meal.id}", nil, auth_headers
      }.to change{ user.meals.count }.by(-1)
      expect(response).to have_http_status(:no_content)
    end

    it "shows user's meal" do
      meal = create(:meal, user: user)

      get "#{base_url}/#{meal.id}", nil, auth_headers
      expect(response).to have_http_status(:ok)
      expect(json['meal']['id']).to eq(meal.id)
    end

    it "doesn't find a meal with wrong id" do
      meal = create(:meal, user: user)
      id = meal.id
      meal.destroy

      get "#{base_url}/#{id}", nil, auth_headers
      expect(response).to have_http_status(:not_found)
    end
  end
  

  context "accessed by admin" do
    it_should_behave_like "the same user" do
      let(:current_user) { admin }
    end
  end
  context "accessed by the same user" do
    it_should_behave_like "the same user" do
      let(:current_user) { user } 
    end
  end

  context "accessed by other user" do
    let(:current_user) { other_user }

    it "denies to retrieve user's entries" do
      get base_url, nil, auth_headers
      expect(response).to have_http_status(:forbidden)
    end

    it "denies to create new entry" do
      post base_url, nil, auth_headers
      expect(response).to have_http_status(:forbidden)
    end

    it "denies to update user's entry" do
      meal = create(:meal, user: user)
      put "#{base_url}/#{meal.id}", nil, auth_headers
      expect(response).to have_http_status(:forbidden)
    end

    it "denies to destroy user's entry" do
      meal = create(:meal, user: user)
      delete "#{base_url}/#{meal.id}", nil, auth_headers
      expect(response).to have_http_status(:forbidden)
    end

    it "denies to show user's entry" do
      meal = create(:meal, user: user)
      get "#{base_url}/#{meal.id}", nil, auth_headers
      expect(response).to have_http_status(:forbidden)
    end

  end

end