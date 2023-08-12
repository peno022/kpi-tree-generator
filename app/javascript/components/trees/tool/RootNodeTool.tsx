import React, { useState, useEffect } from "react";
import NodeDetail from "./nodeDetailArea/NodeDetail";
import OpenModalButton from "../../shared/OpenModalButton";
import { Node, TreeData } from "../../../types";
import { useTreeUpdate } from "../../../hooks/use_tree_update";
import AlertError from "../../shared/AlertError";

type RootNodeToolProps = {
  selectedRootNode: Node;
  onUpdateSuccess: (updatedTreeData: TreeData) => void;
  treeData: TreeData;
};

const RootNodeTool: React.FC<RootNodeToolProps> = ({
  selectedRootNode,
  treeData,
  onUpdateSuccess,
}) => {
  const { errorMessage, sendUpdateRequest, setErrorMessage } = useTreeUpdate(
    treeData.tree.id
  );
  const [nodeInfo, setNodeInfo] = useState<Node>(selectedRootNode);
  const [validatinResult, setValidationResult] = useState<boolean>(true);
  const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(true);

  useEffect(() => {
    setIsUpdateButtonDisabled(!validatinResult);
  }, [validatinResult]);

  const handleNodeInfoChange = (_index = 0, updatedNodeInfo: Node) => {
    setNodeInfo(updatedNodeInfo);
  };

  const saveNodeInfo = async () => {
    setErrorMessage(null);
    const newNodes = treeData.nodes.map((node) => {
      if (node.id === nodeInfo.id) {
        return nodeInfo;
      } else {
        return node;
      }
    });
    const result = await sendUpdateRequest({
      ...treeData,
      nodes: newNodes,
    });
    if (result) {
      onUpdateSuccess(result);
    }
  };

  const handleNodeValidationResultChange = (_index = 0, isValid: boolean) => {
    setValidationResult(isValid);
  };

  return (
    <>
      <div className="relative flex flex-col h-full">
        {errorMessage && <AlertError message={errorMessage} />}
        <div className="absolute inset-0 overflow-y-auto p-2 pb-20" id="tool">
          <NodeDetail
            index={0}
            node={nodeInfo}
            handleNodeInfoChange={handleNodeInfoChange}
            setNodeValidationResult={handleNodeValidationResultChange}
          />
        </div>
        <div
          className="absolute bottom-0 w-full flex justify-center items-center border-t-2 border-base-300 bg-base-100 mt-auto p-2"
          id="updateButton"
        >
          <OpenModalButton
            buttonText="更新"
            disabled={isUpdateButtonDisabled}
            modalButtonText="更新する"
            modalHeadline=""
            modaltext="データを更新してよろしいですか？"
            modalId="updateLayerModal"
            handleClick={saveNodeInfo}
          ></OpenModalButton>
        </div>
      </div>
    </>
  );
};

export default RootNodeTool;
