import { useState } from "react";
import token from "@/token";

export type TreeNameUpdateHook = {
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  sendTreeNameUpdateRequest: (tree: string) => Promise<string | null>;
  isUpdating: boolean;
};

export const patchTreeName = async (name: string, treeId: number) => {
  const response = await fetch(`/api/trees/${treeId}/name.json"`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRF-Token": token(),
    },
    credentials: "same-origin",
    body: JSON.stringify({ name }),
  });
  return response;
};

export const useTreeNameUpdate = (treeId: number): TreeNameUpdateHook => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const sendTreeNameUpdateRequest = async (name: string) => {
    setErrorMessage(null);
    setIsUpdating(true);
    const response = await patchTreeName(name, treeId);
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
    return json.name;
  };

  return {
    errorMessage,
    setErrorMessage,
    sendTreeNameUpdateRequest,
    isUpdating,
  };
};
