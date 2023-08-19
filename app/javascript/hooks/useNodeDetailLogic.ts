import { useState, useEffect } from "react";
import { Node } from "@/types";

export interface FieldValidationResults {
  name: boolean;
  unit: boolean;
  value: boolean;
  valueFormat: boolean;
  isValueLocked: boolean;
}

export interface FieldValidationErrors {
  name: string;
  unit: string;
  value: string;
  valueFormat: string;
  isValueLocked: string;
}

const useNodeDetailLogic = (
  index: number,
  node: Node,
  handleNodeInfoChange: (index: number, newNodeInfo: Node) => void,
  setNodeValidationResult: (index: number, isValid: boolean) => void
) => {
  const [fieldValidationResults, setFieldValidationResults] =
    useState<FieldValidationResults>({
      name: true,
      unit: true,
      value: true,
      valueFormat: true,
      isValueLocked: true,
    });

  const [fieldValidationErrors, setErrors] = useState<FieldValidationErrors>({
    name: "",
    unit: "",
    value: "",
    valueFormat: "",
    isValueLocked: "",
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
    // バリデーションチェック
    if (name === "name" || name === "value") {
      if (value === null || value === "") {
        setFieldValidationResults((prev) => ({
          ...prev,
          [name]: false,
        }));
        setErrors((prev) => ({
          ...prev,
          [name]: "必須項目です",
        }));
        return;
      }
    }
    if (name === "value") {
      if (isNaN(Number(value))) {
        setFieldValidationResults((prev) => ({
          ...prev,
          [name]: false,
        }));
        setErrors((prev) => ({
          ...prev,
          [name]: "数値を入力してください",
        }));
        return;
      }
    }

    if (name === "valueFormat") {
      if (value === "%" && updatedNodeInfo.unit !== "") {
        setFieldValidationResults((prev) => ({
          ...prev,
          unit: false,
          valueFormat: false,
        }));
        setErrors((prev) => ({
          ...prev,
          unit: "％表示のときは単位を空にしてください",
          valueFormat: "％表示のときは単位を空にしてください",
        }));
        return;
      } else {
        setFieldValidationResults((prev) => ({
          ...prev,
          unit: true,
          valueFormat: true,
        }));
        setErrors((prev) => ({
          ...prev,
          unit: "",
          valueFormat: "",
        }));
      }
    }

    if (name === "unit") {
      if (value !== "" && updatedNodeInfo.valueFormat === "%") {
        setFieldValidationResults((prev) => ({
          ...prev,
          unit: false,
          valueFormat: false,
        }));
        setErrors((prev) => ({
          ...prev,
          unit: "％表示のときは単位を空にしてください",
          valueFormat: "％表示のときは単位を空にしてください",
        }));
        return;
      } else {
        setFieldValidationResults((prev) => ({
          ...prev,
          unit: true,
          valueFormat: true,
        }));
        setErrors((prev) => ({
          ...prev,
          unit: "",
          valueFormat: "",
        }));
      }
    }

    setFieldValidationResults((prev) => ({
      ...prev,
      [name]: true,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  return {
    fieldValidationResults,
    fieldValidationErrors,
    handleInputChange,
  };
};

export default useNodeDetailLogic;
