import { useState } from "react";
import { Node, NodeFromApi } from "@/types";
import useFieldValidation from "@/hooks/useFieldValidation";

const useRootNodeToolLogic = (selectedRootNode: NodeFromApi) => {
  const [nodeInfo, setNodeInfo] = useState<Node>(selectedRootNode);

  const { fieldValidationErrors, handleFieldValidationErrorsChange } =
    useFieldValidation(1);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleNodeInfoChange = (_index = 0, newNodeInfo: Node) => {
    setNodeInfo(newNodeInfo);
  };

  return {
    nodeInfo,
    handleNodeInfoChange,
    fieldValidationErrors,
    handleFieldValidationErrorsChange,
  };
};

export default useRootNodeToolLogic;
