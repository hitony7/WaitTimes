# frozen_string_literal: true

class Api::PatientController < ApplicationController
  before_action :authorize_request

  # POST /patients
  def create
    @patient = Patient.new
    @patient.ahc_number = params[:ahc_number]
    @patient.address = params[:address]
    @patient.age = params[:age]
    @patient.name = params[:name]
    @patient.users_id = @current_user.id

    if @patient.save
      render json: @patient, status: :created
    else
      render json: { errors: @patient.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  private

  def patient_params
    params.permit(
      :ahc_number, :address, :age, :name
    )
  end
end
