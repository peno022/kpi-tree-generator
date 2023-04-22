import React from "react";
import NodeValue from "./node_value";
import OperationSymbol from "./operation_symbol";
import Fraction from "./fraction";
import MessageBubble from "./message_bubble";
import { WrappedRawNodeDatum } from "../../../types";

type Props = {
  parentNode: WrappedRawNodeDatum | null;
  selectedNodes: WrappedRawNodeDatum[];
};

const Calculation: React.FC<Props> = ({ parentNode, selectedNodes }) => {
  if (parentNode === null && selectedNodes.length === 1) {
    const rootNode = selectedNodes[0];
    return (
      <NodeValue
        name={rootNode.name}
        value={rootNode.attributes.value}
        displayUnit={getDisplayUnit(rootNode)}
      />
    );
  } else if (parentNode != null && selectedNodes.length > 1) {
    return (
      <>
        <div className="flex flex-row">
          <NodeValue
            name={parentNode.name}
            value={parentNode.attributes.value}
            displayUnit={getDisplayUnit(parentNode)}
          />
          <OperationSymbol operation="equal" />
          {selectedNodes.map((node, index) => {
            return (
              <div key={index} className="flex flex-row">
                <NodeValue
                  name={node.name}
                  value={node.attributes.value}
                  displayUnit={getDisplayUnit(node)}
                />
                {!node.attributes.isLastInLayer &&
                  node.attributes.operation && (
                    <OperationSymbol operation={node.attributes.operation} />
                  )}
              </div>
            );
          })}
          <OperationSymbol operation="add" />
          <Fraction label="端数" />
        </div>
        <MessageBubble
          type="under"
          diffValue={100}
          parentValue={1000}
          displayUnit="万円"
        />
      </>
    );
  } else {
    return <div>ノードが正しく選択できていません。</div>;
  }
};

function getDisplayUnit(node: WrappedRawNodeDatum) {
  if (node.attributes.valueFormat === "なし") {
    return node.attributes.unit;
  } else {
    return `${node.attributes.valueFormat}${node.attributes.unit}`;
  }
}

export default Calculation;
