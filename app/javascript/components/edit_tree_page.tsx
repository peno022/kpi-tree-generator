import React from "react";
import { createRoot } from "react-dom/client";
import ToolArea from "./tool/tool_area";
import TreeArea from "./tree/tree_area";

const EditTreePage = () => {
  const treeId = document.getElementById("tree")?.getAttribute("data-tree-id");
  if (!treeId) {
    return <>treeIdが取得できませんでした。</>;
  } else {
    return (
      <>
        <div className="flex w-full">
          <div
            className="flex-1 ml-1"
            id="treeWrapper"
            style={{
              flexGrow: 2,
              flexBasis: 0,
            }}
          >
            <TreeArea treeId={treeId} />
          </div>
          <div
            className="flex-1 border-l-2 border-base-300 mr-1"
            id="toolWrapper"
            style={{
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            <ToolArea />
          </div>
        </div>
      </>
    );
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tree") as HTMLElement;
  if (container) {
    createRoot(container).render(<EditTreePage />);
  }
});
