import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ToolArea from "./tool/tool_area";
import TreeArea from "./tree/tree_area";
import { TreeNodeEventCallback } from "react-d3-tree/lib/types/Tree/types";
import * as types from "../types";
import { ErrorBoundary } from "react-error-boundary";
import { FallbackProps } from "react-error-boundary/dist/react-error-boundary";
import keysToCamelCase from "../keys_to_camel_case";

const EditTreePage = () => {
  const treeId = document.getElementById("tree")?.getAttribute("data-tree-id");

  const [treeData, setTreeData] = useState<types.TreeData>({
    tree: { id: 0, name: "" },
    nodes: [],
    layers: [],
  });
  const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setisLoading(true);
      try {
        const responce = await fetch(`/api/trees/${treeId}.json`);
        setTreeData(keysToCamelCase(await responce.json()));
      } catch (err) {
        console.log(err);
        return <>エラーが発生しました。</>;
      } finally {
        setisLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) return <>ロード中…</>;

  const handleClick: TreeNodeEventCallback = (node) => {
    const clickedNodeId = node.data?.attributes?.id;
    console.log(`id:${clickedNodeId}: ${node.data.name}をクリック`);

    const clickedNode = treeData.nodes.find(
      (node) => node.id === clickedNodeId
    );
    if (!clickedNode) {
      console.log("ERROR: clickedNode is not found");
    } else if (clickedNode.parentId === null) {
      setSelectedNodeIds([clickedNode.id]);
    } else {
      const siblings = treeData.nodes.filter(
        (node) => node.parentId === clickedNode.parentId
      );
      setSelectedNodeIds(siblings.map((node) => node.id));
    }
  };

  const handleUpdateSuccess = (updatedTreeData: types.TreeData) => {
    setTreeData(updatedTreeData);
    setSelectedNodeIds([]);
  };

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
          <ErrorBoundary fallbackRender={fallbackRender}>
            <TreeArea
              treeData={treeData}
              selectedNodeIds={selectedNodeIds}
              handleClick={handleClick}
            />
          </ErrorBoundary>
          ;
        </div>
        <div
          className="flex-1 border-l-2 border-base-300 mr-1"
          id="toolWrapper"
          style={{
            flexGrow: 1,
            flexBasis: 0,
          }}
        >
          <ErrorBoundary fallbackRender={fallbackRender}>
            <ToolArea
              treeData={treeData}
              selectedNodeIds={selectedNodeIds}
              onUpdateSuccess={handleUpdateSuccess}
            />
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
};

function fallbackRender({ error }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tree") as HTMLElement;
  if (container) {
    createRoot(container).render(<EditTreePage />);
  }
});
