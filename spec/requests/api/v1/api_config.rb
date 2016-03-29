require 'rails_helper'

shared_context 'api config' do
  let(:base_api_url) { '/api/v1' }
  let(:user) { create(:user) }
  let(:other_user) { create(:user, email: 'other@example.com') }
  let(:admin) { create(:user, email: 'admin@example.com', admin: true) }
  let(:password) { build(:user).password }

  let!(:auth_headers) { auth_headers_hash(current_user.email, password) }

  before(:context) { clear_auth_token }
end