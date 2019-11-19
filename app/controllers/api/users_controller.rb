# frozen_string_literal: true

class Api::UsersController < ApplicationController
  before_action :authorize_request, except: :create
  before_action :find_user, only: %i[show update destroy]

  # GET /users
  def index
    @users = User.all

    render json: @users
  end

  # GET /users/1
  def show
    render json: @user
  end

  # POST /users
  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user, status: :created
    else
      render json: { errors: @user.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def find_user
    @user = User.find_by_username!(params[:_username])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: 'User not found' }, status: :not_found
  end

  # Only allow a trusted parameter "white list" through.
  def user_params
    params.permit(
      :first_name, :last_name, :email, :phone, :password, :password_confirmation, :role
    )
  end
end
