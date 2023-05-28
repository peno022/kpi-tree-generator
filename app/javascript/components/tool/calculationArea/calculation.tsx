import React, { useState, useEffect } from "react";
import NodeValue from "./node_value";
import OperationSymbol from "./operation_symbol";
import Fraction from "./fraction";
import MessageBubble from "./message_bubble";
import { Node, Layer } from "../../../types";

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
    handleFractionChange(e.target.valueAsNumber);
  };

  useEffect(() => {
    const newResult = getValueForDisplay(
      calculateNodes(selectedLayer.operation, selectedNodes) +
        (selectedLayer.fraction ?? 0),
      parentNode.valueFormat
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

function getValueForCalculation(node: Node) {
  switch (node.valueFormat) {
    case "なし":
      return node.value;
    case "%":
      return node.value / 100;
    case "千":
      return node.value * 1000;
    case "万":
      return node.value * 10000;
    default:
      return node.value;
  }
}

function getValueForDisplay(
  value: number,
  valueFormat: "なし" | "%" | "千" | "万"
) {
  switch (valueFormat) {
    case "なし":
      return value;
    case "%":
      return value * 100;
    case "千":
      return value / 1000;
    case "万":
      return value / 10000;
    default:
      return value;
  }
}

function calculateNodes(operation: "multiply" | "add", nodes: Node[]) {
  if (operation === "multiply") {
    return nodes.reduce((acc, node) => {
      return acc * getValueForCalculation(node);
    }, 1);
  } else {
    return nodes.reduce((acc, node) => {
      return acc + getValueForCalculation(node);
    }, 0);
  }
}

export default Calculation;
