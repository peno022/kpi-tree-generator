import React from "react";
import NodeField from "@/components/trees/tool/nodeDetailArea/NodeField";
import { Node, FieldValidationErrors, FieldValidationError } from "@/types";
import ToolMenu from "@/components/shared/ToolMenu";
import useNodeDetailLogic from "@/hooks/useNodeDetailLogic";

export type NodeDetailProps = {
  index: number;
  node: Node;
  handleNodeInfoChange: (index: number, newNodeInfo: Node) => void;
  fieldValidationErrors: FieldValidationErrors;
  handleFieldValidationErrorsChange: (errors: FieldValidationError[]) => void;
};
const NodeDetail: React.FC<NodeDetailProps> = ({
  index,
  node,
  handleNodeInfoChange,
  fieldValidationErrors,
  handleFieldValidationErrorsChange,
}) => {
  const { handleInputChange } = useNodeDetailLogic(
    index,
    node,
    handleNodeInfoChange,
    handleFieldValidationErrorsChange
  );

  return (
    <div className="relative">
      <fieldset
        className="border border-base-300 p-2 my-2.5"
        id={`node-detail-${index + 1}`}
      >
        <legend>{`要素${index + 1}`}</legend>
        <div className="absolute right-0 top-2 mt-1.5">
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
          <NodeField
            type="text"
            name="name"
            label="名前"
            value={node.name}
            handleInputChange={handleInputChange}
            isValidField={fieldValidationErrors.name === ""}
            errorMessage={fieldValidationErrors.name}
            index={index + 1}
          />
          <NodeField
            type="text"
            name="unit"
            label="単位"
            value={node.unit}
            handleInputChange={handleInputChange}
            isValidField={fieldValidationErrors.unit === ""}
            errorMessage={fieldValidationErrors.unit}
            index={index + 1}
          />
        </div>
        <div className="flex flex-row space-x-4">
          <NodeField
            type="text"
            name="value"
            label="数値"
            value={node.value}
            handleInputChange={handleInputChange}
            isValidField={fieldValidationErrors.value === ""}
            errorMessage={fieldValidationErrors.value}
            index={index + 1}
          />
          <NodeField
            type="dropdown"
            name="valueFormat"
            label="表示形式"
            value={node.valueFormat}
            handleInputChange={handleInputChange}
            isValidField={fieldValidationErrors.valueFormat === ""}
            errorMessage={fieldValidationErrors.valueFormat}
            index={index + 1}
          />
          <div className="ml-8">
            <NodeField
              type="checkbox"
              name="isValueLocked"
              label="数値を自動更新しない"
              checked={node.isValueLocked}
              handleInputChange={handleInputChange}
              isValidField={fieldValidationErrors.isValueLocked === ""}
              errorMessage={fieldValidationErrors.isValueLocked}
              index={index + 1}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default NodeDetail;
