import { useState } from "react";
import { TreeData } from "../types";
import keysToSnakeCase from "../keys_to_snake_case";
import keysToCamelCase from "../keys_to_camel_case";
import nullifyParentNodeId from "../nullify_parent_node_id";
import token from "../token";

export type TreeUpdateHook = {
  errorMessage: string | null;
  sendUpdateRequest: (treeData: TreeData) => Promise<TreeData | null>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
};

export const useTreeUpdate = (treeId: number): TreeUpdateHook => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendUpdateRequest = async (treeData: TreeData) => {
    setErrorMessage(null);
    const treeDataToSave = nullifyParentNodeId(treeData);
    const bodyData = JSON.stringify(
      keysToSnakeCase({
        tree: { layers: treeDataToSave.layers, nodes: treeDataToSave.nodes },
      })
    );
    try {
      const response = await fetch("/api/trees/" + treeId, {
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
      return keysToCamelCase(json);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
      return null;
    }
  };

  return {
    errorMessage,
    sendUpdateRequest,
    setErrorMessage,
  };
};
