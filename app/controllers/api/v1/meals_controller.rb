module Api
  module V1
    class MealsController < BaseApiController
      before_action :authenticate!, :find_user
      before_action :find_meal, only: [:update, :destroy, :show]

      rescue_from ActionController::ParameterMissing, with: :bad_request

      def index
        raise AccessDeniedError unless 
          UserPolicy.new(current_user, @user).index_meals?
        meals = @user.meals.all
        render json: { meals: meals.as_json }, status: :ok
      end

      def create
        @meal = Meal.new(user: @user)
        authorize @meal
        @meal.assign_attributes(meal_params)
        if @meal.save
          render json: { meal: @meal.as_json }, status: :created
        else
          render json: { errors: @meal.errors.messages.as_json }, status: :bad_request
        end
      end

      def update
        authorize @meal
        if @meal.update_attributes(meal_params)
          render json: nil, status: :no_content
        else
          render json: { errors: @meal.errors.messages.as_json }, status: :bad_request
        end
      end

      def destroy
        authorize @meal
        @meal.destroy
        render json: nil, status: :no_content
      end

      def show
        authorize @meal
        render json: @meal.as_json(root: true), status: :ok
      end

      private
        def find_user
          @user = User.find(params[:user_id])
        end

        def find_meal
          @meal = @user.meals.find(params[:id])
        end

        def meal_params
          params.require(:meal).permit(:description, :calories_number, :consumption_date, :consumption_time)
        end

        def bad_request
          render json: nil, status: :bad_request
        end

    end
  end
end