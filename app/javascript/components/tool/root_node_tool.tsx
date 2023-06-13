import React, { useState, useEffect } from "react";
import NodeDetail from "./nodeDetailArea/node_detail";
import OpenModalButton from "./common/open_modal_button";
import { Node, TreeData } from "../../types";
import keysToSnakeCase from "../../keys_to_snake_case";
import keysToCamelCase from "../../keys_to_camel_case";
import nullifyParentNodeId from "../../nullify_parent_node_id";
import token from "../../token";

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
  const [nodeInfo, setNodeInfo] = useState<Node>(selectedRootNode);
  const [validatinResult, setValidationResult] = useState<boolean>(true);
  const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    const treeDataToSave = nullifyParentNodeId({
      ...treeData,
      nodes: newNodes,
    });
    const bodyData = JSON.stringify(
      keysToSnakeCase({
        tree: {
          layers: treeDataToSave.layers,
          nodes: treeDataToSave.nodes,
        },
      })
    );
    try {
      const response = await fetch("/api/trees/" + treeData.tree.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-Token": token(),
        },
        credentials: "same-origin",
        body: bodyData,
      });
      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }
      const json = await response.json();
      onUpdateSuccess(keysToCamelCase(json));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  const handleNodeValidationResultChange = (_index = 0, isValid: boolean) => {
    setValidationResult(isValid);
  };

  return (
    <>
      <div className="relative flex flex-col h-full">
        <div className="absolute inset-0 overflow-y-auto p-2 pb-20" id="tool">
          <div className="text-error">{errorMessage ? errorMessage : ""}</div>
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
