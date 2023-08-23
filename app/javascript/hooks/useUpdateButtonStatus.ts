import { useState, useEffect } from "react";
import { FieldValidationErrors } from "@/types";

const useUpdateButtonStatus = (
  fieldValidationErrors: FieldValidationErrors[],
  isRoot: boolean,
  fractionValidation?: boolean
) => {
  const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(true);

  useEffect(() => {
    const areAllFieldValidationsTrue = fieldValidationErrors.every((result) => {
      return Object.values(result).every((property) => property === "");
    });
    if (isRoot) {
      setIsUpdateButtonDisabled(!areAllFieldValidationsTrue);
      return;
    }
    setIsUpdateButtonDisabled(
      !areAllFieldValidationsTrue || !fractionValidation
    );
  }, [fieldValidationErrors, fractionValidation]);

  return isUpdateButtonDisabled;
};

export default useUpdateButtonStatus;
