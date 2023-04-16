import React from "react";
import useSWR from "swr";
import fetcher from "../fetcher";
import { convertNodesToRawNodeDatum } from "../convert_nodes_list_to_raw_node_datum";
import { createRoot } from "react-dom/client";
import Tree from "react-d3-tree";
import * as types from "react-d3-tree/lib/types/types/common";
import * as typesOfTree from "react-d3-tree/lib/types/Tree/types";
import CustomNode from "./custom_node";

const EditTree = () => {
  const { data, error } = useSWR(`/api/trees/1.json`, fetcher);
  if (error) return <>エラーが発生しました。</>;
  if (!data) return <>ロード中…</>;
  console.log(data);
  const processedData = convertNodesToRawNodeDatum(data.nodes, data.layers);
  console.log(processedData);

  const handleClick: typesOfTree.TreeNodeEventCallback = (node) => {
    console.log("--- clicked ---");
    console.log(node.data.name);
    console.log("--- end ---");
  };
  return (
    <>
      <div id="treeWrapper" style={{ width: "50em", height: "50em" }}>
        <Tree
          data={processedData}
          pathFunc="diagonal"
          orientation="vertical"
          renderCustomNodeElement={CustomNode}
          onNodeClick={handleClick}
          separation={{ siblings: 2, nonSiblings: 2 }}
        />
      </div>
    </>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tree") as HTMLElement;
  if (container) {
    createRoot(container).render(<EditTree />);
  }
});
