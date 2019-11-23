# frozen_string_literal: true

class Api::TriageQuestionAnswersController < ApplicationController
  before_action :authorize_request

  # POST /triage_question_answers
  def create
    saved = 0
    errors = 0
    arr = JSON.parse(CGI.unescape(params[:items])) # convert our incoming string into the hash
    # from https://stackoverflow.com/questions/54245055/passing-array-of-objects-as-param-to-rails-controller
    arr.each do |i|
      @triage_question_answer = TriageQuestionAnswer.new
      @triage_question_answer.answer_text = i['answer_text']
      @triage_question_answer.triage_questions_id = i['triage_questions_id']
      @triage_question_answer.emergency_room_visits_id = i['emergency_room_visits_id']
      @triage_question_answer.save ? saved += 1 : errors += 1
      # TriageQuestionAnswer.create!(
      #   answer_text: i[:answer_text],
      #   triage_questions_id: i[:triage_questions_id],
      #   emergency_room_visits_id: i[:emergency_room_visits_id]
      # )
    end

    if saved.positive?
      render json: "#{saved} answers saved", status: :created
    else
      render json: "#{errors} errors occured", status: :unprocessable_entity
    end
  end

  # GET /triage_question_answers
  def index
    @triage_question_answers = if @current_user.role == 'triage_staff'
                                 TriageQuestionAnswer.all
                               else
                                 'You do not have permission to perform this query.'
                               end
    render json: @triage_question_answers
  end

  private

  def answer_params
    params.permit(
      :items
    )
  end
end
