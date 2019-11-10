# frozen_string_literal: true

class Api::UserTokenController < Knock::AuthTokenController
  skip_before_action :verify_authenticity_token, raise: false
end
