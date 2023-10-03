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
    if (name === "name") {
      if (value === null || value === "") {
        handleFieldValidationErrorsChange([
          { index, fieldName: "name", errorMessage: "必須項目です" },
        ]);
      } else if (value.toString().length > 15) {
        handleFieldValidationErrorsChange([
          {
            index,
            fieldName: "name",
            errorMessage: "15文字以内で入力してください",
          },
        ]);
      } else {
        handleFieldValidationErrorsChange([
          { index, fieldName: "name", errorMessage: "" },
        ]);
      }
      return;
    }
    if (name === "value") {
      if (value === null || value === "") {
        handleFieldValidationErrorsChange([
          { index, fieldName: name, errorMessage: "必須項目です" },
        ]);
      } else if (isNaN(Number(value))) {
        handleFieldValidationErrorsChange([
          {
            index,
            fieldName: name,
            errorMessage: "数値を入力してください",
          },
        ]);
      } else if (value.toString().length > 9) {
        handleFieldValidationErrorsChange([
          {
            index,
            fieldName: "value",
            errorMessage: "9桁以内で入力してください",
          },
        ]);
      } else {
        handleFieldValidationErrorsChange([
          { index, fieldName: name, errorMessage: "" },
        ]);
      }
      return;
    }

    if (name === "valueFormat") {
      if (updatedNodeInfo.unit !== "") {
        if (value === "%") {
          handleFieldValidationErrorsChange([
            {
              index,
              fieldName: "unit",
              errorMessage: "％表示のときは単位を空にしてください",
            },
            {
              index,
              fieldName: "valueFormat",
              errorMessage: "％表示のときは単位を空にしてください",
            },
          ]);
        } else {
          if (updatedNodeInfo.unit.length > 10) {
            handleFieldValidationErrorsChange([
              {
                index,
                fieldName: "unit",
                errorMessage: "10文字以内で入力してください",
              },
              {
                index,
                fieldName: "valueFormat",
                errorMessage: "",
              },
            ]);
          } else {
            handleFieldValidationErrorsChange([
              {
                index,
                fieldName: "unit",
                errorMessage: "",
              },
              {
                index,
                fieldName: "valueFormat",
                errorMessage: "",
              },
            ]);
          }
        }
      } else {
        handleFieldValidationErrorsChange([
          {
            index,
            fieldName: "unit",
            errorMessage: "",
          },
          {
            index,
            fieldName: "valueFormat",
            errorMessage: "",
          },
        ]);
      }
      return;
    }

    if (name === "unit") {
      if (updatedNodeInfo.valueFormat === "%") {
        if (value !== "") {
          handleFieldValidationErrorsChange([
            {
              index,
              fieldName: "unit",
              errorMessage: "％表示のときは単位を空にしてください",
            },
            {
              index,
              fieldName: "valueFormat",
              errorMessage: "％表示のときは単位を空にしてください",
            },
          ]);
        } else {
          handleFieldValidationErrorsChange([
            {
              index,
              fieldName: "unit",
              errorMessage: "",
            },
            {
              index,
              fieldName: "valueFormat",
              errorMessage: "",
            },
          ]);
        }
      } else {
        if (value.toString().length > 10) {
          handleFieldValidationErrorsChange([
            {
              index,
              fieldName: "unit",
              errorMessage: "10文字以内で入力してください",
            },
          ]);
        } else {
          handleFieldValidationErrorsChange([
            {
              index,
              fieldName: "unit",
              errorMessage: "",
            },
            {
              index,
              fieldName: "valueFormat",
              errorMessage: "",
            },
          ]);
        }
      }
      return;
    }
    handleFieldValidationErrorsChange([
      { index, fieldName: name, errorMessage: "" },
    ]);
  };

  return {
    handleInputChange,
  };
};

export default useNodeDetailLogic;
