import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { useTreeNameUpdate } from "@/hooks/useTreeNameUpdate";

export const TreeName = () => {
  const treeId = Number(
    document.getElementById("tree-name")?.getAttribute("data-tree-id")
  );
  const treeName = document
    .getElementById("tree-name")
    ?.getAttribute("data-tree-name");

  if (!treeId || !treeName || isNaN(treeId)) {
    return (
      <div className="text-error">
        ツリー名の読み込みにエラーが発生しています。画面を再読み込みして再度お試しください。
      </div>
    );
  }

  const [treeNameEditing, setTreeNameEditing] = useState(treeName || "");
  const [isEditing, setIsEditing] = useState(false);
  const {
    errorMessage,
    setErrorMessage,
    sendTreeNameUpdateRequest,
    isUpdating,
  } = useTreeNameUpdate(treeId);

  const handleTreeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeNameEditing(e.target.value);
  };
  const handleTreeNameSubmit = async () => {
    if (isUpdating) return;
    if (treeNameEditing === "") {
      setErrorMessage("ツリー名を入力してください");
      return;
    }
    if (treeNameEditing.length > 50) {
      setErrorMessage("50文字以内で入力してください");
      return;
    }
    if (treeNameEditing === treeName) {
      setIsEditing(false);
      return;
    }
    const updatedName = await sendTreeNameUpdateRequest(treeNameEditing);
    if (updatedName) {
      setTreeNameEditing(updatedName);
      setIsEditing(false);
    } else {
      setTreeNameEditing(treeName);
    }
  };

  const handleEditButtonClick = () => {
    setErrorMessage(null);
    setIsEditing(true);
  };

  const handleCancelEditButtonClick = () => {
    setErrorMessage(null);
    setTreeNameEditing(treeName);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center">
      {isUpdating && <div className="loading loading-spinner mr-2"></div>}
      {isEditing ? (
        <>
          <div className="text-error">{errorMessage}</div>
          <div className="flex">
            <div className="items-center">
              <input
                type="text"
                className="input input-bordered max-w-xs h-10 mr-2.5"
                value={treeNameEditing}
                onChange={handleTreeNameChange}
                name="tree-name-input"
                aria-label="tree-name-input"
              />
              <button
                className="btn btn-sm border-gray-400 bg-slate-50 edit-tree-name-ok h-9"
                onClick={handleTreeNameSubmit}
              >
                OK
              </button>
              <button
                className="btn btn-ghost btn-sm edit-tree-name-cancel"
                onClick={handleCancelEditButtonClick}
              >
                キャンセル
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold md:hidden">
            {treeNameEditing.length > 9
              ? treeNameEditing.slice(0, 9) + "…"
              : treeNameEditing}
          </h1>
          <h1 className="text-xl font-bold hidden md:block">
            {treeNameEditing}
          </h1>
          <button
            className="btn btn-ghost edit-tree-name-button"
            aria-label="Edit tree name"
            onClick={handleEditButtonClick}
          >
            <i className="fa fa-lg fa-pencil" aria-hidden="true"></i>
          </button>
        </>
      )}
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tree-name") as HTMLElement;
  if (container) {
    createRoot(container).render(<TreeName />);
  }
});
