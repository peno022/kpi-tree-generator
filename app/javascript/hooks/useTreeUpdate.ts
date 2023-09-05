import { useState } from "react";
import { TreeData, TreeDataFromApi } from "@/types";
import keysToSnakeCase from "@/keysToSnakeCase";
import keysToCamelCase from "@/keysToCamelCase";
import nullifyParentNodeId from "@/nullifyParentNodeId";
import token from "@/token";

export type TreeUpdateHook = {
  errorMessage: string | null;
  sendUpdateRequest: (treeData: TreeData) => Promise<TreeDataFromApi | null>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  isUpdating: boolean;
};

export const useTreeUpdate = (treeId: number): TreeUpdateHook => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const sendUpdateRequest = async (treeData: TreeData) => {
    setErrorMessage(null);
    setIsUpdating(true);
    const treeDataToSave = nullifyParentNodeId(treeData);
    const bodyData = JSON.stringify(
      keysToSnakeCase({
        tree: { layers: treeDataToSave.layers, nodes: treeDataToSave.nodes },
      })
    );
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
      if (response.status === 422) {
        const json = await response.json();
        setIsUpdating(false);
        setErrorMessage(json.errors.join("／"));
        return null;
      } else if (response.status >= 500) {
        setIsUpdating(false);
        setErrorMessage(
          "システムエラーが発生しました。時間を置いてもう一度お試しください。"
        );
        return null;
      } else if (response.status >= 400) {
        setIsUpdating(false);
        window.location.href = "/404.html";
        return null;
      } else {
        setIsUpdating(false);
        setErrorMessage(
          "システムエラーが発生しました。時間を置いてもう一度お試しください。"
        );
        return null;
      }
    }
    setIsUpdating(false);
    const json = await response.json();
    return keysToCamelCase(json);
  };

  return {
    errorMessage,
    sendUpdateRequest,
    setErrorMessage,
    isUpdating,
  };
};
