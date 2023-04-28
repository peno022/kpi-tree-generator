import React, { useState, useEffect } from "react";
import Operation from "./operation";
import { Layer } from "../../../types";

type Props = {
  selectedLayer: Layer;
};

const Operations: React.FC<Props> = ({ selectedLayer }) => {
  const [selected, setSelected] = useState<"multiply" | "add">("multiply");

  const handleButtonClick = (choice: "multiply" | "add") => {
    setSelected(choice);
  };

  useEffect(() => {
    console.log("------ operations.tsx useEffect ------");
    console.dir(selectedLayer);
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
          onClick={() => handleButtonClick("multiply")}
        />
      </div>

      <div onClick={() => handleButtonClick("add")}>
        <Operation
          isSelected={selected === "add"}
          operation="add"
          onClick={() => handleButtonClick("add")}
        />
      </div>
    </div>
  );
};

export default Operations;
