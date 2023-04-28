import React from "react";

type Props = {
  isSelected: boolean;
  operation: "multiply" | "add";
  onClick: () => void;
};

const Operation: React.FC<Props> = ({ isSelected, operation, onClick }) => {
  const styleSelected = "bg-base-100 border border-neutral";
  const styleUnselected = "bg-base-200 text-base-300 border border-base-200";
  return (
    <button
      className={`w-28 h-8 text-center rounded ${
        isSelected ? styleSelected : styleUnselected
      }`}
      onClick={onClick}
    >
      {operation === "multiply" ? "かけ算" : "たし算"}
    </button>
  );
};

export default Operation;
