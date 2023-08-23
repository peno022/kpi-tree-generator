import { useState } from "react";
import { FieldValidationErrors, FieldValidationError } from "@/types";

const useFieldValidation = (initialNodesLength: number) => {
  const [fieldValidationErrors, setFieldValidationErrors] = useState<
    FieldValidationErrors[]
  >(
    Array(initialNodesLength).fill({
      name: "",
      unit: "",
      value: "",
      valueFormat: "",
      isValueLocked: "",
    })
  );

  const handleFieldValidationErrorsChange: (
    errors: FieldValidationError[]
  ) => void = (errors) => {
    const newFieldValidationErrors = [...fieldValidationErrors];
    errors.forEach((error: FieldValidationError) => {
      const { index, fieldName, errorMessage } = error;
      newFieldValidationErrors[index] = {
        ...newFieldValidationErrors[index],
        [fieldName]: errorMessage,
      };
    });
    setFieldValidationErrors(newFieldValidationErrors);
  };

  return {
    fieldValidationErrors,
    handleFieldValidationErrorsChange,
    setFieldValidationErrors,
  };
};

export default useFieldValidation;
