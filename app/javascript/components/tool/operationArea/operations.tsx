import React, { useState, useEffect } from "react";
import Operation from "./operation";
import { Layer } from "../../../types";

type OperationsProps = {
  selectedLayer: Layer;
  handleOperationChange: (operation: "multiply" | "add") => void;
};

const Operations: React.FC<OperationsProps> = ({
  selectedLayer,
  handleOperationChange,
}) => {
  const [selected, setSelected] = useState<"multiply" | "add">("multiply");

  useEffect(() => {
    if (selectedLayer.operation === "multiply") {
      setSelected("multiply");
    } else {
      setSelected("add");
    }
  }, [selectedLayer]);

  return (
    <div className="flex space-x-4">
      <div>
        <Operation
          isSelected={selected === "multiply"}
          operation="multiply"
          onClick={() => handleOperationChange("multiply")}
        />
      </div>

      <div>
        <Operation
          isSelected={selected === "add"}
          operation="add"
          onClick={() => handleOperationChange("add")}
        />
      </div>
    </div>
  );
};

export default Operations;
