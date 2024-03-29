# frozen_string_literal: true

Rails.application.routes.draw do
  namespace 'api' do
    resources :trees, only: %i[show update] do
      resource :name, only: [:update], module: :trees
    end
  end

  resources :trees, only: %i[create edit destroy]

  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'log_out', to: 'sessions#destroy', as: 'log_out'
  resources :sessions, only: %i[create destroy]

  root 'home#index'
  get '/welcome', to: 'welcome#index'
  get '/privacy-policy', to: 'welcome#privacy_policy'
  get '/terms-of-use', to: 'welcome#terms_of_use'
end
