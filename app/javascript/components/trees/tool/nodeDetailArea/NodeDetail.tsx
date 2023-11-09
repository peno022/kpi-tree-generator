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
  isRoot: boolean;
  deleteNode: (index: number) => void;
};
const NodeDetail: React.FC<NodeDetailProps> = ({
  index,
  node,
  handleNodeInfoChange,
  fieldValidationErrors,
  handleFieldValidationErrorsChange,
  isRoot,
  deleteNode,
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
        className="rounded border border-base-300 px-4 py-2 my-2.5 bg-slate-50"
        id={`node-detail-${index + 1}`}
      >
        <legend className="bg-base-100 border border-base-300 rounded text-sm font-bold flex items-center justify-center h-8 w-16">
          {`要素 ${index + 1}`}
        </legend>
        <div className="absolute right-0 top-2 mt-1.5">
          {!isRoot && (
            <ToolMenu
              menuItems={[
                {
                  label: "要素を削除",
                  onClick: () => deleteNode(index),
                },
              ]}
            />
          )}
        </div>
        <div className="flex flex-row space-x-4 mb-2.5">
          <NodeField
            type="text"
            name="name"
            label="名前"
            value={node.name ?? ""}
            handleInputChange={handleInputChange}
            isValidField={fieldValidationErrors.name === ""}
            errorMessage={fieldValidationErrors.name}
            index={index + 1}
          />
          <NodeField
            type="text"
            name="unit"
            label="単位"
            value={node.unit ?? ""}
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
            value={node.value ?? ""}
            handleInputChange={handleInputChange}
            isValidField={fieldValidationErrors.value === ""}
            errorMessage={fieldValidationErrors.value}
            index={index + 1}
          />
          <NodeField
            type="dropdown"
            name="valueFormat"
            label="表示形式"
            value={node.valueFormat ?? "なし"}
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
              checked={node.isValueLocked ?? false}
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
