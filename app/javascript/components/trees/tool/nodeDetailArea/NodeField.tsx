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
  index: number;
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
  index,
}) => {
  let inputElement: JSX.Element;
  switch (type) {
    case "checkbox": {
      const baseInputClass = "checkbox rounded-sm mt-1";
      inputElement = (
        <input
          type="checkbox"
          name={name}
          onChange={handleInputChange}
          className={
            isValidField ? baseInputClass : `${baseInputClass} checkbox-error`
          }
          checked={checked}
          id={`node-${index}-${name}`}
        />
      );
      break;
    }
    case "number":
    case "text": {
      const baseInputClass = "input input-sm input-bordered w-32 rounded";
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
          value={value}
          required
          id={`node-${index}-${name}`}
        />
      );
      break;
    }
    case "dropdown": {
      const baseSelectClass = "input input-sm input-bordered w-32 rounded";
      const selectClass = isValidField
        ? baseSelectClass
        : `${baseSelectClass} select-error`;
      inputElement = (
        <select
          name={name}
          onChange={handleInputChange}
          className={selectClass}
          value={value}
          id={`node-${index}-${name}`}
        >
          <option>なし</option>
          <option>%</option>
          <option>千</option>
          <option>万</option>
        </select>
      );
    }
  }

  return (
    <div className="flex flex-col">
      <label
        htmlFor={`node-${index}-${name}`}
        className={`text-sm mb-1 ${
          type === "checkbox" ? "cursor-pointer" : ""
        }`}
      >
        {label}
      </label>
      {inputElement}
      {errorMessage && (
        <span
          className={`label-text-alt text-error node-${index}-${name}-error`}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default NodeField;
