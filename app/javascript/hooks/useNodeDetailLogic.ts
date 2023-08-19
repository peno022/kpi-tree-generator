import { Node } from "@/types";

const useNodeDetailLogic = (
  index: number,
  node: Node,
  handleNodeInfoChange: (index: number, newNodeInfo: Node) => void,
  handleFieldValidationResultsChange: (
    index: number,
    fieldName: "name" | "unit" | "value" | "valueFormat" | "isValueLocked",
    isValid: boolean
  ) => void,
  handleFieldValidationErrorsChange: (
    index: number,
    fieldName: "name" | "unit" | "value" | "valueFormat" | "isValueLocked",
    errorMessage: string
  ) => void
) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    if (
      !(
        name === "name" ||
        name === "unit" ||
        name === "value" ||
        name === "valueFormat" ||
        name === "isValueLocked"
      )
    ) {
      return;
    }
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
        handleFieldValidationResultsChange(index, name, false);
        handleFieldValidationErrorsChange(index, name, "必須項目です");
        return;
      }
    }
    if (name === "value") {
      if (isNaN(Number(value))) {
        handleFieldValidationResultsChange(index, name, false);
        handleFieldValidationErrorsChange(
          index,
          name,
          "数値を入力してください"
        );
        return;
      }
    }

    if (name === "valueFormat") {
      if (value === "%" && updatedNodeInfo.unit !== "") {
        handleFieldValidationResultsChange(index, "unit", false);
        handleFieldValidationResultsChange(index, "valueFormat", false);
        handleFieldValidationErrorsChange(
          index,
          "unit",
          "％表示のときは単位を空にしてください"
        );
        handleFieldValidationErrorsChange(
          index,
          "valueFormat",
          "％表示のときは単位を空にしてください"
        );
        return;
      } else {
        handleFieldValidationResultsChange(index, "unit", true);
        handleFieldValidationResultsChange(index, "valueFormat", true);
        handleFieldValidationErrorsChange(index, "unit", "");
        handleFieldValidationErrorsChange(index, "valueFormat", "");
      }
    }

    if (name === "unit") {
      if (value !== "" && updatedNodeInfo.valueFormat === "%") {
        handleFieldValidationResultsChange(index, "unit", false);
        handleFieldValidationResultsChange(index, "valueFormat", false);
        handleFieldValidationErrorsChange(
          index,
          "unit",
          "％表示のときは単位を空にしてください"
        );
        handleFieldValidationErrorsChange(
          index,
          "valueFormat",
          "％表示のときは単位を空にしてください"
        );
        return;
      } else {
        handleFieldValidationResultsChange(index, "unit", true);
        handleFieldValidationResultsChange(index, "valueFormat", true);
        handleFieldValidationErrorsChange(index, "unit", "");
        handleFieldValidationErrorsChange(index, "valueFormat", "");
      }
    }

    handleFieldValidationResultsChange(index, name, true);
    handleFieldValidationErrorsChange(index, name, "");
  };

  return {
    handleInputChange,
  };
};

export default useNodeDetailLogic;
