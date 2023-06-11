import React, { useState, useEffect } from "react";
import NodeValue from "./node_value";
import OperationSymbol from "./operation_symbol";
import Fraction from "./fraction";
import MessageBubble from "./message_bubble";
import { Node, Layer } from "../../../types";
import calculateParentNodeValue from "../../../calculate_parent_node_value";

type Props = {
  selectedNodes: Node[];
  selectedLayer: Layer;
  parentNode: Node;
  handleFractionChange: (fraction: number) => void;
};

const Calculation: React.FC<Props> = ({
  parentNode,
  selectedLayer,
  selectedNodes,
  handleFractionChange,
}) => {
  const maxId = Math.max(...selectedNodes.map((node) => node.id));
  const [calculationResult, setCalculationResult] = useState(0);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      handleFractionChange(0);
      return;
    }

    handleFractionChange(e.target.valueAsNumber);
  };

  useEffect(() => {
    const newResult = calculateParentNodeValue(
      parentNode,
      selectedNodes,
      selectedLayer
    );

    setCalculationResult(newResult);
  }, [selectedNodes, selectedLayer, parentNode]);

  return (
    <>
      <div className="flex flex-row">
        <NodeValue
          name={parentNode.name}
          value={calculationResult}
          displayUnit={getDisplayUnit(parentNode)}
        />
        <OperationSymbol operation="equal" />
        {selectedNodes.map((node, index) => {
          return (
            <div key={index} className="flex flex-row">
              <NodeValue
                name={node.name}
                value={node.value}
                displayUnit={getDisplayUnit(node)}
              />
              {!(node.id === maxId) && (
                <OperationSymbol operation={selectedLayer.operation} />
              )}
            </div>
          );
        })}
        <OperationSymbol operation="add" />
        <Fraction
          label="端数"
          value={selectedLayer.fraction ?? 0}
          onChange={handleInputChange}
        />
      </div>
      {parentNode.value !== calculationResult && (
        <MessageBubble
          diffValue={calculationResult - parentNode.value}
          parentValue={parentNode.value}
          displayUnit={getDisplayUnit(parentNode)}
        />
      )}
    </>
  );
};

function getDisplayUnit(node: Node) {
  const unit = node.unit ? node.unit : "";
  if (node.valueFormat === "なし") {
    return unit;
  } else {
    return `${node.valueFormat}${unit}`;
  }
}

export default Calculation;
