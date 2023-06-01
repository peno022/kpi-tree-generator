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
  setFieldValidationResults: (name: string, isValid: boolean) => void;
};

const NodeField: React.FC<Props> = ({
  type,
  label,
  name,
  handleInputChange,
  placeholder = "",
  value = "",
  checked = false,
  setFieldValidationResults,
}) => {
  const [isValidField, setIsValidField] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // 単項目のバリデーションチェック
    if (
      e.target.name === "name" ||
      e.target.name === "unit" ||
      e.target.name === "value"
    ) {
      if (isEmptyOrNull(e.target.value)) {
        setIsValidField(false);
        setFieldValidationResults(e.target.name, false);
        setErrorMessage("必須項目です");
        return;
      }
    }
    if (e.target.name === "value") {
      if (!isValidNumber(e.target.value)) {
        setIsValidField(false);
        setFieldValidationResults(e.target.name, false);
        setErrorMessage("数値を入力してください");
        return;
      }
    }
    setIsValidField(true);
    setFieldValidationResults(e.target.name, true);
    handleInputChange(e);
  };

  let inputElement: JSX.Element;
  switch (type) {
    case "checkbox":
      inputElement = (
        <input
          type="checkbox"
          name={name}
          onChange={onChange}
          className="checkbox"
          defaultChecked={checked}
        />
      );
      break;
    case "number":
    case "text":
      const baseInputClass = "input input-sm input-bordered w-32";
      const inputClassName = isValidField
        ? baseInputClass
        : `${baseInputClass} input-error`;
      inputElement = (
        <input
          type={type}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClassName}
          defaultValue={value}
          required
        />
      );
      break;
    case "dropdown":
      inputElement = (
        <select
          name={name}
          onChange={onChange}
          className="select select-bordered select-sm w-20"
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
      {!isValidField && (
        <span className="label-text-alt text-error">{errorMessage}</span>
      )}
    </div>
  );
};

function isValidNumber(value: string) {
  return !isNaN(Number(value));
}

function isEmptyOrNull(input: string): boolean {
  return input == null || input.trim() == "";
}

export default NodeField;
