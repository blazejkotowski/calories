module Api
  module V1
    class AccessDeniedError < StandardError
    end
    class NotAuthenticatedError < StandardError
    end
    class AuthenticationTimeoutError < StandardError
    end

    class BaseApiController <  ActionController::Metal
      include AbstractController::Callbacks
      include ActiveSupport::Rescuable
      include ActionController::Rescue
      include ActionController::StrongParameters
      include Pundit

      before_action :set_content_type
      before_action do 
        if Rails.env.development?
          sleep 1
        end
      end

      attr_reader :current_user

      rescue_from AuthenticationTimeoutError, with: :authentication_timeout
      rescue_from NotAuthenticatedError, with: :user_not_authenticated
      rescue_from AccessDeniedError, Pundit::NotAuthorizedError, with: :access_denied
      rescue_from ActiveRecord::RecordNotFound, with: :not_found
      rescue_from ActionController::ParameterMissing, with: :bad_request


      protected
        def render(params)
          if params[:json]
            self.response_body = params[:json].to_json
          else
            self.response_body = nil.to_json
          end
          if params[:status]
            self.status = params[:status]
          end
        end

        def authenticate!
          fail NotAuthenticatedError unless user_id_included_in_auth_token?
          @current_user = User.find(decoded_auth_token[:user_id])
        rescue JWT::ExpiredSignature
          raise AuthenticationTimeoutError
        rescue JWT::VerificationError, JWT::DecodeError
          raise NotAuthenticatedError
        end

      private
        def set_content_type
          self.headers['Content-Type'] = 'application/json'
        end

        # Authentication related
        def user_id_included_in_auth_token?
          http_auth_token && decoded_auth_token && decoded_auth_token[:user_id]
        end

        def decoded_auth_token
          @decoded_auth_token ||= AuthToken.decode(http_auth_token)
        end

        def http_auth_token
          return @http_auth_token if @http_auth_token.present?
          if request.headers['Authorization'].present?
            @http_auth_token = request.headers['Authorization'].split(' ').last
          end
        end

        # Rendering authentication errors
        def authentication_timeout
          render json: nil, status: 419
        end

        def user_not_authenticated
          render json: nil, status: :unauthorized
        end

        def access_denied
          render json: nil, status: :forbidden
        end

        # Rendering other common errors
        def not_found
          render json: nil, status: :not_found
        end

        def bad_request
          render json: nil, status: :bad_request
        end

    end
  end
end