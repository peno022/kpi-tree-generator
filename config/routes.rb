# frozen_string_literal: true

Rails.application.routes.draw do
  get 'react/hello'
  root 'home#index'
  get '/privacy-policy', to: 'welcome#privacy_policy'
  get '/terms-of-use', to: 'welcome#terms_of_use'
end
