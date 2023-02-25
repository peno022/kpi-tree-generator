# frozen_string_literal: true

Rails.application.routes.draw do
  namespace 'api' do
    resources :trees, only: %i[show create update]
  end
  get 'react/hello'
  root 'home#index'
  get '/privacy-policy', to: 'welcome#privacy_policy'
  get '/terms-of-use', to: 'welcome#terms_of_use'
end
