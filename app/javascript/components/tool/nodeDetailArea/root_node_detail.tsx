import React from "react";
import NodeField from "./node_field";
import { Node } from "../../../types";
import { parentNode } from "../../../../../spec/javascript/__fixtures__/sample_data";

type RootNodeDetailProps = {
  node: Node;
  handleNodeInfoChange: (newNodeInfo: Node) => void;
};

const RootNodeDetail: React.FC<RootNodeDetailProps> = ({
  node,
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
    handleNodeInfoChange(updatedNodeInfo);
  };
  console.log("-----parentNode-------");
  console.log(parentNode);
  console.log("-------------------");
  return (
    <>
      <div className="border border-base-300 p-2 my-2">
        <div className="flex justify-between items-center mb-1.5">
          <div className="text-base font-semibold">ルート要素</div>
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
            name="valueFormat"
            label="表示形式"
            value={node.valueFormat}
            onChange={handleInputChange}
          />
          <div className="ml-8">
            <NodeField
              type="checkbox"
              name="isValueLocked"
              label="数値を自動更新しない"
              checked={node.isValueLocked}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RootNodeDetail;
