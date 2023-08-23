import { useState } from "react";
import {
  FieldValidationResults,
  FieldValidationErrors,
  FieldValidationError,
} from "@/types";

const useFieldValidation = (initialNodesLength: number) => {
  const [fieldValidationResults, setFieldValidationResults] = useState<
    FieldValidationResults[]
  >(
    Array(initialNodesLength).fill({
      name: true,
      unit: true,
      value: true,
      valueFormat: true,
      isValueLocked: true,
    })
  );

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
  const handleFieldValidationResultsChange: (
    index: number,
    fieldName: "name" | "unit" | "value" | "valueFormat" | "isValueLocked",
    isValid: boolean
  ) => void = (index, fieldName, isValid) => {
    const newResults = [...fieldValidationResults];
    newResults[index] = { ...newResults[index], [fieldName]: isValid };
    setFieldValidationResults(newResults);
  };

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
    fieldValidationResults,
    fieldValidationErrors,
    handleFieldValidationResultsChange,
    handleFieldValidationErrorsChange,
    setFieldValidationErrors,
    setFieldValidationResults,
  };
};

export default useFieldValidation;
