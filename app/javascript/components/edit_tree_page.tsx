import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ToolArea from "./tool/tool_area";
import TreeArea from "./tree/tree_area";
import useSWR from "swr";
import fetcher from "../fetcher";
import { TreeNodeEventCallback } from "react-d3-tree/lib/types/Tree/types";
import * as types from "../types";

const EditTreePage = () => {
  const treeId = document.getElementById("tree")?.getAttribute("data-tree-id");

  const { data, error } = useSWR(`/api/trees/${treeId}.json`, fetcher);
  const [treeData, setTreeData] = useState<types.TreeData>({
    tree: { id: 0, name: "" },
    nodes: [],
    layers: [],
  });
  const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);

  useEffect(() => {
    if (data) {
      setTreeData(data);
    }
  }, [data]);

  if (error) return <>エラーが発生しました。</>;
  if (!data) return <>ロード中…</>;

  const handleClick: TreeNodeEventCallback = (node) => {
    console.log("--- handleClick start ---");
    const clickedNodeId = node.data?.attributes?.id;
    console.log(`id:${clickedNodeId}: ${node.data.name}をクリック`);

    const clickedNode = treeData.nodes.find(
      (node) => node.id === clickedNodeId
    );
    if (!clickedNode) {
      console.log("ERROR: clickedNode is not found");
    } else if (clickedNode.parent_id === null) {
      setSelectedNodeIds([clickedNode.id]);
    } else {
      const siblings = treeData.nodes.filter(
        (node) => node.parent_id === clickedNode.parent_id
      );
      setSelectedNodeIds(siblings.map((node) => node.id));
    }
    console.log("--- handleClick end ---");
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
          <TreeArea
            treeData={data}
            selectedNodeIds={selectedNodeIds}
            handleClick={handleClick}
          />
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
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tree") as HTMLElement;
  if (container) {
    createRoot(container).render(<EditTreePage />);
  }
});
