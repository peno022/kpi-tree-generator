import React from "react";
import { ToolMenu } from "./common/tool_menu";
import Operations from "./operationArea/operations";
import Calculation from "./calculationArea/calculation";
import NodeDetail from "./nodeDetailArea/node_detail";
import * as types from "../../types";

type Props = {
  treeData: types.TreeData;
  selectedNodeIds: number[];
};

const ToolArea: React.FC<Props> = ({ treeData, selectedNodeIds }) => {
  const { nodes, layers } = treeData;
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
  const parentNode = nodes.find(
    (node) => node.id === selectedNodes[0].parent_id
  );

  if (!parentNode) {
    return (
      <>
        <div className="relative flex flex-col h-full">
          <div className="absolute inset-0 overflow-y-auto p-2 pb-20" id="tool">
            {selectedNodes.map((node, index) => (
              <NodeDetail
                key={node.id}
                order={index + 1}
                node={node}
                isRoot={true}
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

  let selectedLayer: types.Layer | undefined;
  if (parentNode) {
    selectedLayer = layers.find(
      (layer) => layer.parent_node_id === parentNode.id
    );
  }

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
            <Operations />
          </div>
          <div className="mb-4">
            <Calculation
              selectedNodes={selectedNodes}
              selectedLayer={selectedLayer}
              parentNode={parentNode}
            ></Calculation>
          </div>
          {selectedNodes.map((node, index) => (
            <NodeDetail
              key={node.id}
              order={index + 1}
              node={node}
              isRoot={false}
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

export default ToolArea;
