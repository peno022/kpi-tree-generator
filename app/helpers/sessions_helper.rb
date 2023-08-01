# frozen_string_literal: true

module SessionsHelper
  def current_user
    return unless (user_id = session[:user_id])

    @current_user ||= User.find_by(id: user_id)
  end

  def log_in(user)
    session[:user_id] = user.id
  end

  # rubocop:disable Rails/HelperInstanceVariable

  def log_out
    session.delete(:user_id)
    @current_user = nil
  end
  # rubocop:enable Rails/HelperInstanceVariable
end
