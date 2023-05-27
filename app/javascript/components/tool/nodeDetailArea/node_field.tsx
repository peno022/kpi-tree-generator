import React from "react";

type Props = {
  type: "text" | "number" | "checkbox" | "dropdown";
  label: string;
  name: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  value?: string | number;
  checked?: boolean;
};

const NodeField: React.FC<Props> = ({
  type,
  label,
  name,
  onChange,
  placeholder = "",
  value = "",
  checked = false,
}) => {
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
      inputElement = (
        <input
          type="number"
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          className="input input-bordered input-sm w-24"
          defaultValue={value}
        />
      );
      break;
    case "text":
      inputElement = (
        <input
          type="text"
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          className="input input-sm input-bordered w-32"
          defaultValue={value}
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
    </div>
  );
};

export default NodeField;
