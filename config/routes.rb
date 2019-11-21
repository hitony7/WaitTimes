# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api do
    get '/data', to: 'tests#index' # /api/data
    post '/login', to: 'authentication#login'

    post '/patient', to: 'patient#create'
    post '/event', to: 'emergency_room_visit#create'
    get '/event', to: 'emergency_room_visit#index'
    post '/triage_question_answers', to: 'triage_question_answers#create'

    resources :users

    resources :triage_questions
  end

  get '*path', to: 'static_pages#fallback_index_html', constraints: lambda { |request|
    !request.xhr? && request.format.html?
  }
end
