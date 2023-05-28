import React from "react";

type FractionProps = {
  label: string;
  placeholder?: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Fraction: React.FC<FractionProps> = ({
  label,
  placeholder = "",
  value = 0,
  onChange,
}) => {
  return (
    <div className="flex flex-col">
      <div className="text-xs">{label}</div>
      <input
        type="number"
        placeholder={placeholder}
        className="input input-bordered input-xs w-20"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Fraction;
