module Api
  module V1
    class AuthController < BaseApiController
      def authenticate
        u = User.find_by_email(params['email'])
        if u && u.authenticate(params['password'])
          render json: authentication_payload(u), status: :ok
        else
          render json: { errors: ["Authentication failed"] }, status: :unauthorized
        end
      end

      private
        def authentication_payload(user)
          if user.nil? || user.id.nil?
            return nil
          end
          {
            auth_token: AuthToken.encode({ user_id: user.id }),
            user: user.as_json(only: [:id, :email, :expected_calories])
          }
        end
    end
  end
end