import React, { useEffect, useState } from "react";
import NodeDetail from "./nodeDetailArea/node_detail";
import { Node, Layer } from "../../types";
import ToolMenu from "./common/tool_menu";
import Operations from "./operationArea/operations";
import Calculation from "./calculationArea/calculation";

type LayerToolProps = {
  selectedNodes: Node[];
  selectedLayer: Layer;
  parentNode: Node;
};

export type LayerToolState = {
  nodes: Node[];
  layer: Layer;
};

const LayerTool: React.FC<LayerToolProps> = ({
  selectedNodes,
  selectedLayer,
  parentNode,
}) => {
  const [layerProperty, setlayerProperty] = useState<LayerToolState>({
    nodes: selectedNodes,
    layer: selectedLayer,
  });

  useEffect(() => {
    setlayerProperty({
      ...layerProperty,
      nodes: selectedNodes,
      layer: selectedLayer,
    });
  }, [selectedNodes, selectedLayer, parentNode]);

  const handleNodeInfoChange = (index: number, newNodeInfo: Node) => {
    const newValues = [...layerProperty.nodes];
    newValues[index] = newNodeInfo;
    setlayerProperty({
      ...layerProperty,
      nodes: newValues,
    });
  };

  const handleOperationChange = (operation: "multiply" | "add") => {
    const newLayerValues = { ...layerProperty.layer };
    newLayerValues.operation = operation;
    setlayerProperty({
      ...layerProperty,
      layer: newLayerValues,
    });
  };

  const handleFractionChange = (fraction: number) => {
    const newLayerValues = { ...layerProperty.layer };
    newLayerValues.fraction = fraction;
    setlayerProperty({
      ...layerProperty,
      layer: newLayerValues,
    });
  };

  return (
    <>
      <div className="relative flex flex-col h-full">
        <div className="absolute inset-0 overflow-y-auto p-2 pb-20" id="tool">
          <div className="flex justify-between items-center mb-1.5">
            <div className="text-base font-semibold">要素間の関係</div>
            <ToolMenu
              menuItems={[
                {
                  label: "階層を削除",
                  onClick: () => {
                    console.log("階層を削除");
                  },
                },
              ]}
            />
          </div>
          <div className="mb-4">
            <Operations
              selectedLayer={layerProperty.layer}
              handleOperationChange={handleOperationChange}
            />
          </div>
          <div className="mb-4">
            <Calculation
              selectedNodes={layerProperty.nodes}
              selectedLayer={layerProperty.layer}
              parentNode={parentNode}
              handleFractionChange={handleFractionChange}
            ></Calculation>
          </div>
          {layerProperty.nodes.map((node, index) => (
            <NodeDetail
              key={node.id}
              index={index}
              node={node}
              handleNodeInfoChange={handleNodeInfoChange}
            />
          ))}
          <div className="flex justify-center">
            <button className="btn btn-sm btn-outline">要素を追加</button>
          </div>
        </div>
        <div
          className="absolute bottom-0 w-full flex justify-center items-center border-t-2 border-base-300 bg-base-100 mt-auto p-2"
          id="updateButton"
        >
          <button className="btn btn-primary">更新</button>
        </div>
      </div>
    </>
  );
};

export default LayerTool;
