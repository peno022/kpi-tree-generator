import React, { useEffect } from "react";
import NodeDetail from "@/components/trees/tool/nodeDetailArea/NodeDetail";
import OpenModalButton from "@/components/shared/OpenModalButton";
import { NodeFromApi, TreeDataFromApi } from "@/types";
import { useTreeUpdate } from "@/hooks/useTreeUpdate";
import AlertError from "@/components/shared/AlertError";
import useRootNodeToolLogic from "@/hooks/useRootNodeToolLogic";
import useUpdateButtonStatus from "@/hooks/useUpdateButtonStatus";

type RootNodeToolProps = {
  selectedRootNode: NodeFromApi;
  onUpdateSuccess: (updatedTreeData: TreeDataFromApi) => void;
  treeData: TreeDataFromApi;
  onUpdateStatusChange: (isUpdating: boolean) => void;
  handleErrorMessage: (errorMessage: string | null) => void;
  errorMessage: string | null;
};

const RootNodeTool: React.FC<RootNodeToolProps> = ({
  selectedRootNode,
  treeData,
  onUpdateSuccess,
  onUpdateStatusChange,
  handleErrorMessage,
  errorMessage,
}) => {
  const { sendUpdateRequest, isUpdating } = useTreeUpdate(
    treeData.tree.id,
    handleErrorMessage
  );

  const {
    nodeInfo,
    handleNodeInfoChange,
    fieldValidationErrors,
    handleFieldValidationErrorsChange,
  } = useRootNodeToolLogic(selectedRootNode);

  useEffect(() => {
    onUpdateStatusChange(isUpdating);
  }, [isUpdating]);

  const isUpdateButtonDisabled = useUpdateButtonStatus(
    fieldValidationErrors,
    true
  );

  const saveNodeInfo = async () => {
    handleErrorMessage(null);
    if (nodeInfo.id === undefined || nodeInfo.id === null) {
      handleErrorMessage(
        "システムエラーが発生しました。画面を再読み込みしてもう一度お試しください。"
      );
      return;
    }
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

  const mockDeleteNode = (index = 0) => {
    console.log(`delete node ${index}`);
  };

  return (
    <>
      {errorMessage && <AlertError message={errorMessage} />}
      <div className="relative flex flex-col h-full">
        <div className="absolute inset-0 overflow-y-auto p-2 pb-24" id="tool">
          <NodeDetail
            index={0}
            node={nodeInfo}
            handleNodeInfoChange={handleNodeInfoChange}
            fieldValidationErrors={fieldValidationErrors[0]}
            handleFieldValidationErrorsChange={
              handleFieldValidationErrorsChange
            }
            isRoot={true}
            deleteNode={mockDeleteNode}
          />
        </div>
        <div
          className="absolute bottom-0 w-full flex justify-center items-center border-t-2 border-base-300 bg-base-100 mt-auto p-4"
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
