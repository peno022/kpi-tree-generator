import React from "react";

type Props = {
  label: string;
  placeholder?: string;
  value?: number;
};

const Fraction: React.FC<Props> = ({ label, placeholder = "", value }) => {
  return (
    <div className="flex flex-col">
      <div className="text-xs">{label}</div>
      <input
        type="number"
        placeholder={placeholder}
        className="input input-bordered input-xs w-20"
        defaultValue={value}
      />
    </div>
  );
};

export default Fraction;
