import React from "react";

type Props = {
  label: string;
  placeholder?: string;
};

const NumberInputField: React.FC<Props> = ({ label, placeholder = "" }) => {
  return (
    <div className="flex flex-col">
      <div className="text-xs">{label}</div>
      <input
        type="number"
        placeholder={placeholder}
        className="input input-bordered input-xs w-24"
      />
    </div>
  );
};

export default NumberInputField;
