require 'test_helper'

class TriageQuestionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @triage_question = triage_questions(:one)
  end

  test "should get index" do
    get triage_questions_url, as: :json
    assert_response :success
  end

  test "should create triage_question" do
    assert_difference('TriageQuestion.count') do
      post triage_questions_url, params: { triage_question: {  } }, as: :json
    end

    assert_response 201
  end

  test "should show triage_question" do
    get triage_question_url(@triage_question), as: :json
    assert_response :success
  end

  test "should update triage_question" do
    patch triage_question_url(@triage_question), params: { triage_question: {  } }, as: :json
    assert_response 200
  end

  test "should destroy triage_question" do
    assert_difference('TriageQuestion.count', -1) do
      delete triage_question_url(@triage_question), as: :json
    end

    assert_response 204
  end
end
