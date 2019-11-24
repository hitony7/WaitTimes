require 'test_helper'

class ChatboxesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @chatbox = chatboxes(:one)
  end

  test "should get index" do
    get chatboxes_url, as: :json
    assert_response :success
  end

  test "should create chatbox" do
    assert_difference('Chatbox.count') do
      post chatboxes_url, params: { chatbox: { text: @chatbox.text } }, as: :json
    end

    assert_response 201
  end

  test "should show chatbox" do
    get chatbox_url(@chatbox), as: :json
    assert_response :success
  end

  test "should update chatbox" do
    patch chatbox_url(@chatbox), params: { chatbox: { text: @chatbox.text } }, as: :json
    assert_response 200
  end

  test "should destroy chatbox" do
    assert_difference('Chatbox.count', -1) do
      delete chatbox_url(@chatbox), as: :json
    end

    assert_response 204
  end
end
