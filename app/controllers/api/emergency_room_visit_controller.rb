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
    @ervisit.patients_id = params[:patients_id]

    if @ervisit.save
      render json: @ervisit, status: :created
    else
      render json: { errors: @ervisit.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  # GET /event; only gives events for currently logged in user
  def index
    @ervisit = EmergencyRoomVisit
               .where('emergency_room_visits.users_id = ? AND emergency_room_visits.is_active = ?', @current_user.id, true).joins(:patient)
               .select('emergency_room_visits.*, patients.*')

    render json: @ervisit
  end

  private

  def emergency_room_visit_params
    params.permit(
      :visit_description, :given_wait_time_minutes, :users_id, :emergency_rooms_id, :patients_id
    )
  end
end
