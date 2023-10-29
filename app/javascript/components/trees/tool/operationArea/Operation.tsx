import React from "react";

export type OperationProps = {
  isSelected: boolean;
  operation: "multiply" | "add";
  onClick: () => void;
};

const Operation: React.FC<OperationProps> = ({
  isSelected,
  operation,
  onClick,
}) => {
  const styleSelected = "bg-slate-50 border border-gray-400";
  const styleUnselected = "bg-gray-200 text-gray-400 border border-gray-400";

  const roundedMultiply = "rounded-l-md";
  const roundedAdd = "rounded-r-md";
  const borderMultiply = "border-r-0";

  return (
    <button
      className={`w-28 h-8 text-center ${
        operation === "multiply"
          ? `${roundedMultiply} ${borderMultiply}`
          : roundedAdd
      } ${isSelected ? styleSelected : styleUnselected}`}
      onClick={onClick}
    >
      {operation === "multiply" ? "かけ算" : "たし算"}
    </button>
  );
};

export default Operation;
