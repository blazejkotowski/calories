module Requests
  module AuthHelpers
    def get_auth_token(email, password)
      return @auth_token if @auth_token.present?
      post '/api/v1/authenticate', { email: email, password: password }
      @auth_token = json['auth_token']
    end

    def auth_headers_hash(email, password)
      @auth_token ||= get_auth_token(email, password)
      { 'Authorization' => "Bearer #{@auth_token}" }
    end

    def clear_auth_token
      @auth_token = nil
    end
  end
end