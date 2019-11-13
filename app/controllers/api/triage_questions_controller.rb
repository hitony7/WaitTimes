class Api::TriageQuestionsController < ApplicationController
  before_action :authenticate_user # requires JWT authentication
  # before_action :set_triage_question, only: [:show, :update, :destroy]

  # GET /triage_questions
  def index
    @triage_questions = TriageQuestion.all

    render json: @triage_questions
  end

  # GET /triage_questions/1
  def show
    render json: @triage_question
  end

  # POST /triage_questions
  def create
    @triage_question = TriageQuestion.new(triage_question_params)

    if @triage_question.save
      render json: @triage_question, status: :created, location: @triage_question
    else
      render json: @triage_question.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /triage_questions/1
  def update
    if @triage_question.update(triage_question_params)
      render json: @triage_question
    else
      render json: @triage_question.errors, status: :unprocessable_entity
    end
  end

  # DELETE /triage_questions/1
  def destroy
    @triage_question.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_triage_question
      @triage_question = TriageQuestion.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def triage_question_params
      params.fetch(:triage_question, {})
    end
end
