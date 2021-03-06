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
  def myevents
    @ervisit = EmergencyRoomVisit
               .where('emergency_room_visits.users_id = ? AND emergency_room_visits.is_active = ?', @current_user.id, true).joins(:patient)
               .select('emergency_room_visits.id, emergency_room_visits.visit_description, emergency_room_visits.given_wait_time_minutes, emergency_room_visits.updated_at AS assigned_timestamp,emergency_room_visits.users_id AS caregiver_id, emergency_room_visits.created_at AS event_date, emergency_room_visits.patients_id, patients.*').order('created_at DESC')

    render json: @ervisit
  end

  # GET /events; all events for the triage staff
  def allevents
    if @current_user.role == 'triage_staff'
      @ervisit = EmergencyRoomVisit
                 .where('emergency_room_visits.is_active = ?', true).joins(:patient).joins(:user)
                 .select('emergency_room_visits.id, emergency_room_visits.visit_description, emergency_room_visits.given_wait_time_minutes, emergency_room_visits.updated_at AS updated_date, emergency_room_visits.created_at AS event_date, emergency_room_visits.triage_comment, emergency_room_visits.patients_id, emergency_room_visits.users_id AS caregiver_id, patients.address AS patient_address, patients.name AS patient_name, patients.allergies, patients.gender, patients.caregiver_relationship, patients.ahc_number AS patient_ahc_number, patients.name AS patient_name, patients.age AS patient_age, users.first_name AS caregiver_first_name, users.last_name AS caregiver_last_name, users.phone').order('emergency_room_visits.created_at DESC')
    else
      @ervisit = 'You do not have permission to perform this query.'
    end
    render json: @ervisit
  end

  # POST /ervisit/id
  def update_event
    if @current_user.role == 'triage_staff'
      @visit = EmergencyRoomVisit.find(params[:id])
      @visit.triage_comment = params[:triage_comment]
      @visit.given_wait_time_minutes = params[:given_wait_time_minutes]
      if @visit.save
        render json: @visit
      else
        render json: { errors: @visit.errors.full_messages },
               status: :unprocessable_entity
      end
    else
      render json: 'You do not have permission to perform this query.'
    end
  end

  private

  def emergency_room_visit_params
    params.permit(
      :id, :visit_description, :given_wait_time_minutes, :users_id, :emergency_rooms_id, :patients_id, :triage_comment
    )
  end
end
