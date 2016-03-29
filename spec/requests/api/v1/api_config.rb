require 'rails_helper'

shared_context 'api config' do
  let(:base_api_url) { '/api/v1' }
  let(:password) { 'pass123' }

  before :all do
    @user = create(:user)
    @other_user = create(:user, email: 'other@example.com')
    @admin = create(:user, email: 'admin@example.com', admin: true)
  end

  after :all do
    User.destroy_all
  end

  let!(:auth_headers) { auth_headers_hash(current_user.email, password) }

  before(:context) { clear_auth_token }
end