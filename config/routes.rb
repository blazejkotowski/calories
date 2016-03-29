Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      post 'authenticate' => 'auth#authenticate'
    end
  end
end
