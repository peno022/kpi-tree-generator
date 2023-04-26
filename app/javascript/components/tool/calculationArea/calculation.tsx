import React from "react";
import NodeValue from "./node_value";
import OperationSymbol from "./operation_symbol";
import Fraction from "./fraction";
import MessageBubble from "./message_bubble";
import { Node, Layer } from "../../../types";

type Props = {
  selectedNodes: Node[];
  selectedLayer: Layer | undefined;
  parentNode: Node | undefined;
};

const Calculation: React.FC<Props> = ({
  parentNode,
  selectedLayer,
  selectedNodes,
}) => {
  if (!parentNode && selectedNodes.length === 1) {
    const rootNode = selectedNodes[0];
    return (
      <NodeValue
        name={rootNode.name}
        value={rootNode.value}
        displayUnit={getDisplayUnit(rootNode)}
      />
    );
  } else if (parentNode && selectedNodes.length > 1) {
    const maxId = Math.max(...selectedNodes.map((node) => node.id));
    return (
      <>
        <div className="flex flex-row">
          <NodeValue
            name={parentNode.name}
            value={parentNode.value}
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
                {!(node.id === maxId) && selectedLayer && (
                  <OperationSymbol operation={selectedLayer.operation} />
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

function getDisplayUnit(node: Node) {
  if (node.value_format === "なし") {
    return node.unit;
  } else {
    return `${node.value_format}${node.unit}`;
  }
}

export default Calculation;
