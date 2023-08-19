import { useState } from "react";
import { Node, NodeFromApi } from "@/types";
import useFieldValidation from "@/hooks/useFieldValidation";

const useRootNodeToolLogic = (selectedRootNode: NodeFromApi) => {
  const [nodeInfo, setNodeInfo] = useState<Node>(selectedRootNode);

  const {
    fieldValidationResults,
    fieldValidationErrors,
    handleFieldValidationResultsChange,
    handleFieldValidationErrorsChange,
  } = useFieldValidation(1);

  const handleNodeInfoChange = (_index = 0, newNodeInfo: Node) => {
    setNodeInfo(newNodeInfo);
  };

  return {
    nodeInfo,
    handleNodeInfoChange,
    fieldValidationResults,
    fieldValidationErrors,
    handleFieldValidationResultsChange,
    handleFieldValidationErrorsChange,
  };
};

export default useRootNodeToolLogic;
