class ChatboxesController < ApplicationController
  before_action :set_chatbox, only: [:show, :update, :destroy]

  # GET /chatboxes
  def index
    @chatboxes = Chatbox.all

    render json: @chatboxes
  end

  # GET /chatboxes/1
  def show
    render json: @chatbox
  end

  # POST /chatboxes
  def create
    @chatbox = Chatbox.new(chatbox_params)

    if @chatbox.save
      render json: @chatbox, status: :created, location: @chatbox
    else
      render json: @chatbox.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /chatboxes/1
  def update
    if @chatbox.update(chatbox_params)
      render json: @chatbox
    else
      render json: @chatbox.errors, status: :unprocessable_entity
    end
  end

  # DELETE /chatboxes/1
  def destroy
    @chatbox.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_chatbox
      @chatbox = Chatbox.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def chatbox_params
      params.require(:chatbox).permit(:text)
    end
end
