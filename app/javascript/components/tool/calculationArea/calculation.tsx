import React, { useState, useEffect } from "react";
import NodeValue from "./node_value";
import OperationSymbol from "./operation_symbol";
import Fraction from "./fraction";
import MessageBubble from "./message_bubble";
import { Node } from "../../../types";

type Props = {
  selectedNodes: Node[];
  operation: "add" | "multiply";
  parentNode: Node;
};

const Calculation: React.FC<Props> = ({
  parentNode,
  operation,
  selectedNodes,
}) => {
  const maxId = Math.max(...selectedNodes.map((node) => node.id));
  const [calculationResult, setCalculationResult] = useState(0);

  useEffect(() => {
    let newResult = 0;
    if (operation === "multiply") {
      newResult = selectedNodes.reduce((acc, node) => {
        return acc * getValueForCalculation(node);
      }, 1);
    } else if (operation === "add") {
      newResult = selectedNodes.reduce((acc, node) => {
        return acc + getValueForCalculation(node);
      }, 0);
    }
    setCalculationResult(
      getValueForDisplay(newResult, parentNode.value_format)
    );
  }, [selectedNodes, operation]);

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
                <OperationSymbol operation={operation} />
              )}
            </div>
          );
        })}
        <OperationSymbol operation="add" />
        <Fraction label="端数" />
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
  if (node.value_format === "なし") {
    return unit;
  } else {
    return `${node.value_format}${unit}`;
  }
}

function getValueForCalculation(node: Node) {
  switch (node.value_format) {
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

export default Calculation;
