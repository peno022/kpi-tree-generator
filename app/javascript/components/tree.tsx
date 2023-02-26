import React from "react";
import useSWR from "swr";
import fetcher from "../fetcher";
import processTreeForD3 from "../process_tree_for_d3";
import { createRoot } from "react-dom/client";
import Tree from "react-d3-tree";
import * as types from "react-d3-tree/lib/types/types/common";

const CustomNode: types.RenderCustomNodeElementFn = ({ nodeDatum }) => {
  return (
    <g>
      <rect
        x="-75"
        rx="5"
        ry="5"
        style={{
          width: "150",
          height: "85",
          fill: "ghostwhite",
          stroke: "dimgray",
          strokeWidth: "1",
        }}
      />
      <text
        x="-60"
        y="38"
        style={{
          fill: "#333",
          strokeWidth: "0",
          fontWeight: "bold",
          fontSize: "1.2em",
          maxWidth: "280",
        }}
      >
        {nodeDatum.name}
      </text>
      <text
        x="-60"
        y="65"
        style={{
          fill: "#333",
          strokeWidth: "0",
          fontSize: "1em",
          maxWidth: "280",
        }}
      >
        {nodeDatum.attributes?.value}
        {nodeDatum.attributes?.valueFormat === "なし"
          ? ""
          : nodeDatum.attributes?.valueFormat}
        {nodeDatum.attributes?.unit}
      </text>
    </g>
  );
};

const EditTree = () => {
  const { data, error } = useSWR(`/api/trees/1.json`, fetcher);
  if (error) return <>エラーが発生しました。</>;
  if (!data) return <>ロード中…</>;
  console.log(data);
  const processedData = processTreeForD3(data.tree.root);
  return (
    <>
      <div id="treeWrapper" style={{ width: "50em", height: "50em" }}>
        <Tree
          data={processedData}
          pathFunc="step"
          orientation="vertical"
          renderCustomNodeElement={CustomNode}
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
