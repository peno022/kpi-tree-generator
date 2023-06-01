import React, { useEffect, useState } from "react";
import NodeField from "./node_field";
import { Node } from "../../../types";
import ToolMenu from "../common/tool_menu";

type NodeDetailProps = {
  index: number;
  node: Node;
  handleNodeInfoChange: (index: number, newNodeInfo: Node) => void;
  setNodeValidationResult: (index: number, isValid: boolean) => void;
};
export interface FieldValidationResults {
  name: boolean;
  unit: boolean;
  value: boolean;
  valueFormat: boolean;
  isValueLocked: boolean;
}
const NodeDetail: React.FC<NodeDetailProps> = ({
  index,
  node,
  handleNodeInfoChange,
  setNodeValidationResult,
}) => {
  const [fieldValidationResults, setFieldValidationResults] =
    useState<FieldValidationResults>({
      name: true,
      unit: true,
      value: true,
      valueFormat: true,
      isValueLocked: true,
    });

  useEffect(() => {
    setNodeValidationResult(
      index,
      Object.values(fieldValidationResults).every((result) => result)
    );
  }, [fieldValidationResults]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    let value: string | number | boolean;
    if (e.target instanceof HTMLInputElement) {
      value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value.trim();
    } else {
      value = e.target.value.trim();
    }
    const updatedNodeInfo = { ...node, [name]: value };

    handleNodeInfoChange(index, updatedNodeInfo);
  };
  const handleFieldValidationResultsChange = (
    name: string,
    isValid: boolean
  ) => {
    setFieldValidationResults((prev) => ({
      ...prev,
      [name]: isValid,
    }));
  };
  return (
    <>
      <div className="border border-base-300 p-2 my-2">
        <div className="flex justify-between items-center mb-1.5">
          <div className="text-base font-semibold">{`要素${index + 1}`}</div>
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
            setFieldValidationResults={handleFieldValidationResultsChange}
          />
          <NodeField
            type="text"
            name="unit"
            label="単位"
            value={node.unit}
            handleInputChange={handleInputChange}
            setFieldValidationResults={handleFieldValidationResultsChange}
          />
        </div>
        <div className="flex flex-row space-x-2">
          <NodeField
            type="number"
            name="value"
            label="数値"
            value={node.value}
            handleInputChange={handleInputChange}
            setFieldValidationResults={handleFieldValidationResultsChange}
          />
          <NodeField
            type="dropdown"
            name="valueFormat"
            label="表示形式"
            value={node.valueFormat}
            handleInputChange={handleInputChange}
            setFieldValidationResults={handleFieldValidationResultsChange}
          />
          <div className="ml-8">
            <NodeField
              type="checkbox"
              name="isValueLocked"
              label="数値を自動更新しない"
              checked={node.isValueLocked}
              handleInputChange={handleInputChange}
              setFieldValidationResults={handleFieldValidationResultsChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NodeDetail;
