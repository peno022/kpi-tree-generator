import React, { useState } from "react";
import Operation from "./operation";

const Operations: React.FC = () => {
  const [selected, setSelected] = useState<"multiply" | "add">("multiply");

  const handleButtonClick = (choice: "multiply" | "add") => {
    setSelected(choice);
  };

  return (
    <div className="flex space-x-4">
      <div>
        <Operation
          isSelected={selected === "multiply"}
          operation="かけ算"
          onClick={() => handleButtonClick("multiply")}
        />
      </div>

      <div onClick={() => handleButtonClick("add")}>
        <Operation
          isSelected={selected === "add"}
          operation="たし算"
          onClick={() => handleButtonClick("add")}
        />
      </div>
    </div>
  );
};

export default Operations;
