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
        setErrorMessage(json.errors.join("／"));
        return null;
      } else if (response.status >= 500) {
        setErrorMessage(
          "システムエラーが発生しました。時間を置いてもう一度お試しください。"
        );
        return null;
      } else if (response.status >= 400) {
        window.location.href = "/404.html";
        return null;
      } else {
        setErrorMessage(
          "システムエラーが発生しました。時間を置いてもう一度お試しください。"
        );
        return null;
      }
    }
    const json = await response.json();
    console.log("-----result.json------");
    console.dir(json);
    return keysToCamelCase(json);
  };

  return {
    errorMessage,
    sendUpdateRequest,
    setErrorMessage,
  };
};
