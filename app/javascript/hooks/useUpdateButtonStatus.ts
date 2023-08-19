import { useState, useEffect } from "react";
import { FieldValidationResults, FieldValidationErrors } from "@/types";

const useUpdateButtonStatus = (
  fieldValidationResults: FieldValidationResults[],
  isRoot: boolean,
  fractionValidation?: boolean
) => {
  const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(true);

  useEffect(() => {
    const areAllFieldValidationsTrue = fieldValidationResults.every(
      (result) => {
        return Object.values(result).every((property) => property === true);
      }
    );
    if (isRoot) {
      setIsUpdateButtonDisabled(!areAllFieldValidationsTrue);
      return;
    }
    setIsUpdateButtonDisabled(
      !areAllFieldValidationsTrue || !fractionValidation
    );
  }, [fieldValidationResults, fractionValidation]);

  return isUpdateButtonDisabled;
};

export default useUpdateButtonStatus;
