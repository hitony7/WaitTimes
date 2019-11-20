# frozen_string_literal: true

class Api::EmergencyRoomVisitController < ApplicationController
  before_action :authorize_request

  # POST /event
  def create
    @ervisit = EmergencyRoomVisit.new
    @ervisit.visit_description = params[:visit_description]
    @ervisit.given_wait_time_minutes = params[:given_wait_time_minutes]
    @ervisit.emergency_rooms_id = params[:emergency_rooms_id]
    @ervisit.users_id = @current_user.id

    if @ervisit.save
      render json: @ervisit, status: :created
    else
      render json: { errors: @ervisit.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  private

  def emergency_room_visit_params
    params.permit(
      :visit_description, :given_wait_time_minutes, :users_id, :emergency_rooms_id
    )
  end
end