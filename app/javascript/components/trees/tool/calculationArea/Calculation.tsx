import React, { useState, useEffect } from "react";
import NodeValue from "@/components/trees/tool/calculationArea/NodeValue";
import OperationSymbol from "@/components/trees/tool/calculationArea/OperationSymbol";
import Fraction from "@/components/trees/tool/calculationArea/Fraction";
import MessageBubble from "@/components/trees/tool/calculationArea/MessageBubble";
import { Node, Layer } from "@/types";
import calculateParentNodeValue from "@/calculateParentNodeValue";

type CalculationProps = {
  selectedNodes: Node[];
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
  const maxId = Math.max(...selectedNodes.map((node) => node.id));
  const [calculationResult, setCalculationResult] = useState(0);

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
                elementId={index}
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

function getDisplayUnit(node: Node) {
  const unit = node.unit ? node.unit : "";
  if (node.valueFormat === "なし") {
    return unit;
  } else {
    return `${node.valueFormat}${unit}`;
  }
}

export default Calculation;
