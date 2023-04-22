import React from "react";
import NodeField from "./node_field";
import { WrappedRawNodeDatum } from "../../../types";
import { ToolMenu } from "../common/tool_menu";
type Props = {
  order: number;
  node: WrappedRawNodeDatum;
};

const NodeDetail: React.FC<Props> = ({ order, node }) => {
  return (
    <>
      <div className="border border-base-300 p-2 my-2">
        <div className="flex justify-between items-center mb-1.5">
          <div className="text-base bg-base-100">{`要素${order}`}</div>
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
        </div>
        <div className="flex flex-row space-x-4 mb-1.5">
          <NodeField type="text" label="名前" value={node.name} />
          <NodeField type="text" label="単位" value={node.attributes.unit} />
        </div>
        <div className="flex flex-row space-x-2">
          <NodeField type="number" label="数値" value={node.attributes.value} />
          <NodeField
            type="dropdown"
            label="表示形式"
            value={node.attributes.valueFormat}
          />
          <div className="ml-8">
            <NodeField
              type="checkbox"
              label="数値を自動更新しない"
              checked={node.attributes.isValueLocked}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NodeDetail;
