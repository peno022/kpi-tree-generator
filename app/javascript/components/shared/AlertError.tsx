import React from "react";

type AlertErrorProps = {
  message: string;
  buttonText?: string;
};

const AlertError: React.FC<AlertErrorProps> = ({ message, buttonText }) => {
  return (
    <div className="alert alert-error">
      <span>{message}</span>
      {buttonText && (
        <button className="btn btn-sm btn-outline">{buttonText}</button>
      )}
    </div>
  );
};

export default AlertError;
