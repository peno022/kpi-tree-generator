# frozen_string_literal: true

module SessionsHelper
  def current_user
    return unless (user_id = session[:user_id])

    User.find_by(id: user_id)
  end

  def log_in(user)
    session[:user_id] = user.id
  end

  def log_out
    session.delete(:user_id)
  end
end
