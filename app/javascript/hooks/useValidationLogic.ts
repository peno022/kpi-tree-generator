import { useState, useEffect } from "react";

const useValidationLogic = (initialLength: number) => {
  const [nodeValidationResults, setNodeValidationResults] = useState<boolean[]>(
    Array(initialLength).fill(true)
  );
  const [fractionValidation, setFractionValidation] = useState(true);
  const [fractionErrorMessage, setFractionErrorMessage] = useState<
    string | null
  >(null);

  const isAllValid = (results: boolean[]): boolean => {
    return results.every((result) => result);
  };

  const handleNodeValidationResultsChange = (
    index: number,
    isValid: boolean
  ) => {
    const newValues = [...nodeValidationResults];
    newValues[index] = isValid;
    setNodeValidationResults(newValues);
  };

  const useUpdateButtonStatus = () => {
    const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(true);
    useEffect(() => {
      setIsUpdateButtonDisabled(
        !isAllValid(nodeValidationResults) || !fractionValidation
      );
    }, [nodeValidationResults, fractionValidation]);
    return isUpdateButtonDisabled;
  };

  return {
    setNodeValidationResults,
    handleNodeValidationResultsChange,
    fractionValidation,
    setFractionValidation,
    fractionErrorMessage,
    setFractionErrorMessage,
    useUpdateButtonStatus,
  };
};

export default useValidationLogic;
