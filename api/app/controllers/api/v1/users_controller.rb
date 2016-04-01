module Api
  module V1
    class UsersController < BaseApiController
      before_action :authenticate!, except: [:create]
      before_action :find_user, only: [:show, :update, :destroy]

      def index
        authorize User
        users = User.all
        body = { users: users.as_json(only: [:name, :email, :id, :created_at], root: true)}
        render json: { users: users }, status: :ok
      end

      def create
        authorize User
        new_user = User.new(user_params)
        if(new_user.save)
          render json: { user: new_user.as_json(only: [:name, :email, :expected_calories]) }, status: :created
        else
          render json: { errors: new_user.errors.messages.as_json }, status: :bad_request
        end
      end

      def show
        authorize @user
        render json: { user: @user.as_json(only: [:name, :email, :expected_calories, :id, :created_at]) }, status: :ok
      end
      
      def update
        authorize @user
        if(@user.update_attributes(user_params))
          render json: nil, status: :no_content
        else
          print "#{user_params}\n"
          print @user.errors.messages
          render json: { errors: @user.errors.messages.as_json }, status: :bad_request
        end
      end

      def destroy
        authorize @user
        @user.destroy
        render json: nil, status: :no_content
      end

      private
        def find_user
          @user = User.find(params[:id])
        end

        def user_params
          params.require(:user).permit(:name, :email, :password, :password_confirmation, :expected_calories)
        end

    end
  end
end