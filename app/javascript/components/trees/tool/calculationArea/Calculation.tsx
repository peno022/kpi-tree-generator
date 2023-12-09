import React, { useState, useEffect } from "react";
import NodeValue from "@/components/trees/tool/calculationArea/NodeValue";
import OperationSymbol from "@/components/trees/tool/calculationArea/OperationSymbol";
import Fraction from "@/components/trees/tool/calculationArea/Fraction";
import MessageBubble from "@/components/trees/tool/calculationArea/MessageBubble";
import { Node, Layer } from "@/types";
import calculateParentNodeValue from "@/calculateParentNodeValue";

export type NodeProperty = {
  id?: number;
  name: string;
  value: number | string;
  valueFormat: "なし" | "%" | "千" | "万";
  unit: string;
  isValueLocked: boolean;
  parentId: number;
};

type CalculationProps = {
  selectedNodes: NodeProperty[];
  selectedLayer: Layer;
  inputFraction: string;
  fractionValidation: boolean;
  parentNode: Node;
  fractionErrorMessage: string | null;
  handleFractionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Calculation: React.FC<CalculationProps> = ({
  selectedNodes,
  selectedLayer,
  inputFraction,
  fractionValidation,
  parentNode,
  fractionErrorMessage,
  handleFractionChange,
}) => {
  const maxIndex = selectedNodes.length - 1;
  const [calculationResult, setCalculationResult] = useState(0);

  useEffect(() => {
    const newSelectedNodes = convertInvalidValueToZero(selectedNodes);
    const newResult = calculateParentNodeValue(
      parentNode,
      newSelectedNodes,
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
          elementId="parent"
        />
        <OperationSymbol operation="equal" />
        {selectedNodes.map((node, index) => {
          return (
            <div key={index} className="flex flex-row">
              <NodeValue
                name={node.name}
                value={node.value}
                displayUnit={getDisplayUnit(node)}
                elementId={index + 1}
              />
              {!(index === maxIndex) && (
                <OperationSymbol operation={selectedLayer.operation} />
              )}
            </div>
          );
        })}
        <OperationSymbol operation="add" />
        <Fraction
          label="端数"
          value={inputFraction}
          onChange={handleFractionChange}
          fractionValidation={fractionValidation}
          errorMessage={fractionErrorMessage}
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

function getDisplayUnit(node: NodeProperty) {
  const unit = node.unit ? node.unit : "";
  if (node.valueFormat === "なし") {
    return unit;
  } else {
    return `${node.valueFormat}${unit}`;
  }
}

function convertInvalidValueToZero(nodes: NodeProperty[]): Node[] {
  return nodes.map((node) => {
    if (
      node.value === null ||
      node.value === undefined ||
      node.value === "" ||
      isNaN(Number(node.value))
    ) {
      return {
        ...node,
        value: 0,
      };
    } else {
      return {
        ...node,
        value: Number(node.value),
      };
    }
  });
}

export default Calculation;
