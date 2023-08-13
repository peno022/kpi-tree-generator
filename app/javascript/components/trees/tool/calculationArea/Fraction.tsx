import React from "react";

type FractionProps = {
  label: string;
  placeholder?: string;
  value: string;
  fractionValidation: boolean;
  errorMessage: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Fraction: React.FC<FractionProps> = ({
  label,
  placeholder = "",
  value = "0",
  fractionValidation,
  errorMessage,
  onChange,
}) => {
  const baseInputClass = "input input-bordered input-xs w-20";
  const inputClass = fractionValidation
    ? baseInputClass
    : `${baseInputClass} input-error`;
  return (
    <div className="flex flex-col">
      <label htmlFor="fraction" className="text-xs">
        {label}
      </label>
      <input
        type="text"
        name="fraction"
        id="fraction"
        placeholder={placeholder}
        className={inputClass}
        value={value}
        onChange={onChange}
      />
      {errorMessage && (
        <span className="label-text-alt text-error">{errorMessage}</span>
      )}
    </div>
  );
};

export default Fraction;
