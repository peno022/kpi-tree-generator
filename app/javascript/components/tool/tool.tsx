import React from "react";
import { ToolMenu } from "./common/tool_menu";
import Operations from "./operationArea/operations";
import Calculation from "./calculationArea/calculation";
import NodeDetail from "./nodeDetailArea/node_detail";
import { WrappedRawNodeDatum } from "../../types";

export const Tool = () => {
  const selectedNodes: WrappedRawNodeDatum[] = [
    {
      name: "購入者数",
      attributes: {
        id: 2,
        value: 5000,
        valueFormat: "なし",
        unit: "人",
        isValueLocked: false,
        operation: "multiply",
        isLastInLayer: false,
      },
    },
    {
      name: "商品単価",
      attributes: {
        id: 3,
        value: 1200,
        valueFormat: "なし",
        unit: "円",
        isValueLocked: true,
        operation: "multiply",
        isLastInLayer: false,
      },
    },
    {
      name: "購入個数",
      attributes: {
        id: 4,
        value: 1.6,
        valueFormat: "なし",
        unit: "円",
        isValueLocked: false,
        operation: "multiply",
        isLastInLayer: true,
      },
    },
  ];
  const parentNode: WrappedRawNodeDatum = {
    name: "売上金額",
    attributes: {
      id: 1,
      value: 1000,
      valueFormat: "万",
      unit: "円",
      isValueLocked: true,
      isLastInLayer: true,
    },
    children: selectedNodes,
  };

  return (
    <>
      <div className="relative flex flex-col h-full">
        <div className="absolute inset-0 overflow-y-auto p-2 pb-20" id="tool">
          <div className="flex justify-between items-center mb-1.5">
            <div className="text-base bg-base-100">要素間の関係</div>
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
              parentNode={parentNode}
            ></Calculation>
          </div>
          {selectedNodes.map((node, index) => (
            <NodeDetail
              key={node.attributes.id}
              order={index + 1}
              node={node}
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
