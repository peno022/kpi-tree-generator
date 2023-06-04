import React, { useState, useEffect } from "react";
import NodeDetail from "./nodeDetailArea/node_detail";
import OpenModalButton from "./common/open_modal_button";
import { Node } from "../../types";

type RootNodeToolProps = {
  selectedRootNode: Node;
};

const RootNodeTool: React.FC<RootNodeToolProps> = ({ selectedRootNode }) => {
  const [nodeInfo, setNodeInfo] = useState<Node>(selectedRootNode);
  const [validatinResult, setValidationResult] = useState<boolean>(true);
  const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(true);

  useEffect(() => {
    setIsUpdateButtonDisabled(!validatinResult);
  }, [validatinResult]);

  const handleNodeInfoChange = (_index = 0, updatedNodeInfo: Node) => {
    setNodeInfo(updatedNodeInfo);
  };

  const saveLayerProperty = async () => {
    console.log("saveLayerProperty");
    // TODO: 更新用APIを呼び出す
  };

  const handleNodeValidationResultChange = (_index = 0, isValid: boolean) => {
    setValidationResult(isValid);
  };

  return (
    <>
      <div className="relative flex flex-col h-full">
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
            handleClick={saveLayerProperty}
          ></OpenModalButton>
        </div>
      </div>
    </>
  );
};

export default RootNodeTool;