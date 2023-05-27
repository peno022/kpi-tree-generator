import React, { useState, useEffect } from "react";
import { ToolMenu } from "./common/tool_menu";
import Operations from "./operationArea/operations";
import Calculation from "./calculationArea/calculation";
import NodeDetail from "./nodeDetailArea/node_detail";
import * as types from "../../types";

type Props = {
  treeData: types.TreeData;
  selectedNodeIds: number[];
};

export type ToolAreaState = {
  // operation, culculationResultも後からここに追加する
  nodes: types.Node[];
};

const ToolArea: React.FC<Props> = ({ treeData, selectedNodeIds }) => {
  const [layerProperty, setlayerProperty] = useState<ToolAreaState>({
    nodes: [
      {
        id: 0,
        name: "",
        value: 0,
        unit: "",
        value_format: "",
        is_value_locked: false,
        parent_id: 0,
      },
    ],
  });

  const handleNodeInfoChange = (index: number, newNodeInfo: types.Node) => {
    const newValues = [...layerProperty.nodes];
    newValues[index] = newNodeInfo;
    setlayerProperty({
      ...layerProperty,
      nodes: newValues,
    });
  };

  const { nodes, layers } = treeData;

  useEffect(() => {
    if (selectedNodeIds.length > 0) {
      const selectedNodes: types.Node[] = nodes.filter((node) =>
        selectedNodeIds.includes(node.id)
      );

      setlayerProperty({
        ...layerProperty,
        nodes: selectedNodes,
      });
    }
  }, [selectedNodeIds, nodes]);

  if (selectedNodeIds.length === 0) {
    return (
      <div className="p-2 text-center mt-6">
        <p className="">要素を選択すると、ここに詳細が表示されます。</p>
      </div>
    );
  }

  const selectedNodes: types.Node[] = nodes.filter((node) =>
    selectedNodeIds.includes(node.id)
  );

  if (selectedNodes.length === 0) {
    return (
      <div className="p-2 text-center mt-6">
        <p className="">選択されたノードIDが不正です。</p>
      </div>
    );
  }

  const parentNode = nodes.find(
    (node) => node.id === selectedNodes[0].parent_id
  );

  if (!parentNode) {
    return (
      <>
        <div className="relative flex flex-col h-full">
          <div className="absolute inset-0 overflow-y-auto p-2 pb-20" id="tool">
            {layerProperty.nodes.map((node, index) => (
              <NodeDetail
                key={node.id}
                index={index}
                node={node}
                isRoot={true}
                handleNodeInfoChange={handleNodeInfoChange}
              />
            ))}
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
  }

  const selectedLayer = layers.find(
    (layer) => layer.parent_node_id === parentNode.id
  );

  if (!selectedLayer) {
    return <>存在しない階層です。</>;
  } else {
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
              <Operations selectedLayer={selectedLayer} />
            </div>
            <div className="mb-4">
              <Calculation
                selectedNodes={layerProperty.nodes}
                selectedLayer={selectedLayer}
                parentNode={parentNode}
              ></Calculation>
            </div>
            {layerProperty.nodes.map((node, index) => (
              <NodeDetail
                key={node.id}
                index={index}
                node={node}
                isRoot={false}
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
  }
};

export default ToolArea;
