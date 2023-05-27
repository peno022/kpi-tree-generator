import React from "react";
import NodeField from "./node_field";
import { Node } from "../../../types";
import { ToolMenu } from "../common/tool_menu";

type NodeDetailProps = {
  index: number;
  node: Node;
  isRoot: boolean;
  handleNodeInfoChange: (index: number, newNodeInfo: Node) => void;
};

const NodeDetail: React.FC<NodeDetailProps> = ({
  index,
  node,
  isRoot = false,
  handleNodeInfoChange,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    let value: string | number | boolean;
    if (e.target instanceof HTMLInputElement) {
      value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    } else {
      value = e.target.value;
    }
    const updatedNodeInfo = { ...node, [name]: value };
    handleNodeInfoChange(index, updatedNodeInfo);
  };
  return (
    <>
      <div className="border border-base-300 p-2 my-2">
        <div className="flex justify-between items-center mb-1.5">
          <div className="text-base font-semibold">
            {isRoot ? "ルート要素" : `要素${index + 1}`}
          </div>
          {!isRoot && (
            <ToolMenu
              menuItems={[
                {
                  label: "要素を削除",
                  onClick: () => {
                    console.log("要素を削除");
                  },
                },
              ]}
            />
          )}
        </div>
        <div className="flex flex-row space-x-4 mb-1.5">
          <NodeField
            type="text"
            name="name"
            label="名前"
            value={node.name}
            onChange={handleInputChange}
          />
          <NodeField
            type="text"
            name="unit"
            label="単位"
            value={node.unit}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-row space-x-2">
          <NodeField
            type="number"
            name="value"
            label="数値"
            value={node.value}
            onChange={handleInputChange}
          />
          <NodeField
            type="dropdown"
            name="value_format"
            label="表示形式"
            value={node.value_format}
            onChange={handleInputChange}
          />
          <div className="ml-8">
            <NodeField
              type="checkbox"
              name="is_value_locked"
              label="数値を自動更新しない"
              checked={node.is_value_locked}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NodeDetail;
