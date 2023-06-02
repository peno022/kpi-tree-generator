import React from "react";

type Props = {
  type: "text" | "number" | "checkbox" | "dropdown";
  label: string;
  name: string;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  value?: string | number;
  checked?: boolean;
  isValidField: boolean;
  errorMessage: string;
};

const NodeField: React.FC<Props> = ({
  type,
  label,
  name,
  handleInputChange,
  placeholder = "",
  value = "",
  checked = false,
  isValidField,
  errorMessage,
}) => {
  let inputElement: JSX.Element;
  switch (type) {
    case "checkbox":
      inputElement = (
        <input
          type="checkbox"
          name={name}
          onChange={handleInputChange}
          className={isValidField ? "checkbox" : "checkbox checkbox-error"}
          defaultChecked={checked}
        />
      );
      break;
    case "number":
    case "text":
      const baseInputClass = "input input-sm input-bordered w-32";
      const inputClass = isValidField
        ? baseInputClass
        : `${baseInputClass} input-error`;
      inputElement = (
        <input
          type={type}
          name={name}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={inputClass}
          defaultValue={value}
          required
        />
      );
      break;
    case "dropdown":
      const baseSelectClass = "input input-sm input-bordered w-32";
      const selectClass = isValidField
        ? baseSelectClass
        : `${baseSelectClass} select-error`;
      inputElement = (
        <select
          name={name}
          onChange={handleInputChange}
          className={selectClass}
          defaultValue={value}
        >
          <option>なし</option>
          <option>%</option>
          <option>千</option>
          <option>万</option>
        </select>
      );
  }

  return (
    <div className="flex flex-col">
      <div className="text-sm">{label}</div>
      {inputElement}
      {errorMessage && (
        <span className="label-text-alt text-error">{errorMessage}</span>
      )}
    </div>
  );
};

export default NodeField;
