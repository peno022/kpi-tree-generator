import { Node, FieldValidationError } from "@/types";

const useNodeDetailLogic = (
  index: number,
  node: Node,
  handleNodeInfoChange: (index: number, newNodeInfo: Node) => void,
  handleFieldValidationErrorsChange: (errors: FieldValidationError[]) => void
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
        handleFieldValidationErrorsChange([
          { index: index, fieldName: name, errorMessage: "必須項目です" },
        ]);
        return;
      }
    }
    if (name === "value") {
      if (isNaN(Number(value))) {
        handleFieldValidationErrorsChange([
          {
            index: index,
            fieldName: name,
            errorMessage: "数値を入力してください",
          },
        ]);
        return;
      }
    }

    if (name === "valueFormat") {
      if (value === "%" && updatedNodeInfo.unit !== "") {
        handleFieldValidationErrorsChange([
          {
            index: index,
            fieldName: "unit",
            errorMessage: "％表示のときは単位を空にしてください",
          },
          {
            index: index,
            fieldName: "valueFormat",
            errorMessage: "％表示のときは単位を空にしてください",
          },
        ]);
        return;
      } else {
        handleFieldValidationErrorsChange([
          {
            index: index,
            fieldName: "unit",
            errorMessage: "",
          },
          {
            index: index,
            fieldName: "valueFormat",
            errorMessage: "",
          },
        ]);
      }
    }

    if (name === "unit") {
      if (value !== "" && updatedNodeInfo.valueFormat === "%") {
        handleFieldValidationErrorsChange([
          {
            index: index,
            fieldName: "unit",
            errorMessage: "％表示のときは単位を空にしてください",
          },
          {
            index: index,
            fieldName: "valueFormat",
            errorMessage: "％表示のときは単位を空にしてください",
          },
        ]);
        return;
      } else {
        handleFieldValidationErrorsChange([
          {
            index: index,
            fieldName: "unit",
            errorMessage: "",
          },
          {
            index: index,
            fieldName: "valueFormat",
            errorMessage: "",
          },
        ]);
      }
    }
    handleFieldValidationErrorsChange([
      { index: index, fieldName: name, errorMessage: "" },
    ]);
  };

  return {
    handleInputChange,
  };
};

export default useNodeDetailLogic;
