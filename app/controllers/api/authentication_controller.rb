# frozen_string_literal: true

class Api::AuthenticationController < ApplicationController
  before_action :authorize_request, except: :login
  # from https://medium.com/binar-academy/rails-api-jwt-authentication-a04503ea3248

  # POST /auth/login
  def login
    @user = User.find_by_email(params[:email])
    if @user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: @user.id)
      time = Time.now + 24.hours.to_i
      render json: { token: token, exp: time.strftime('%m-%d-%Y %H:%M'),
                     role: @user.role,
                     caregiver_id: @user.id }, status: :ok
    else
      render json: { error: 'unauthorized' }, status: :unauthorized
    end
  end

  private

  def login_params
    params.permit(:email, :password)
  end
end
