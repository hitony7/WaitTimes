class Api::TestsController < ApplicationController
  def index
    render :json => {
      message: "Hello from the rails server!"
    }
  end
end