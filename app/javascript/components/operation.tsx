import React from "react";

type Props = {
  isSelected: boolean;
  operation: "かけ算" | "たし算";
  onClick: () => void;
};

const Operation: React.FC<Props> = ({ isSelected, operation, onClick }) => {
  const style_selected = "bg-base-100 border border-neutral";
  const style_unselected = "bg-base-200 text-base-300 border border-base-200";
  return (
    <button
      className={`w-28 h-8 text-center rounded ${
        isSelected ? style_selected : style_unselected
      }`}
      onClick={onClick}
    >
      {operation}
    </button>
  );
};

export default Operation;
