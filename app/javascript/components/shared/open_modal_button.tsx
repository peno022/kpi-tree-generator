import React from "react";

type OpenModalButtonProps = {
  buttonText: string;
  disabled: boolean;
  modalId: string;
  modalHeadline: string;
  modaltext: string;
  modalButtonText: string;
  handleClick: () => void;
};

const OpenModalButton: React.FC<OpenModalButtonProps> = ({
  buttonText,
  disabled,
  modalId,
  modalHeadline,
  modaltext,
  modalButtonText,
  handleClick,
}) => {
  const buttonClass = `btn btn-primary ${disabled ? "btn-disabled" : ""}`;
  return (
    <>
      {/* The button to open modal */}
      <label htmlFor={modalId} className={buttonClass}>
        {buttonText}
      </label>

      {/* The modal */}
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal cursor-pointer">
        <div className="modal-box">
          <label
            htmlFor={modalId}
            className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg">{modalHeadline}</h3>
          <p className="py-4">{modaltext}</p>
          <div className="modal-action">
            <label htmlFor={modalId} className="btn btn-ghost">
              キャンセル
            </label>
            <label htmlFor={modalId} className="btn" onClick={handleClick}>
              {modalButtonText}
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenModalButton;
