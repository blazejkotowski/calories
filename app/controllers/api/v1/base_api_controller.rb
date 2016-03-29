module Api
  module V1
    class BaseApiController <  ActionController::Metal
      include AbstractController::Callbacks
      before_action :set_content_type

      private
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

        def set_content_type
          self.headers['Content-Type'] = 'application/json'
        end
    end
  end
end