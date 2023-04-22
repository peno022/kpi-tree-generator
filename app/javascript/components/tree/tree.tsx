import React, { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "../../fetcher";
import { convertNodesToRawNodeDatum } from "../../convert_nodes_list_to_raw_node_datum";
import { selectNodes } from "../../select_nodes";
import { createRoot } from "react-dom/client";
import Tree from "react-d3-tree";
import * as types from "react-d3-tree/lib/types/types/common";
import * as typesOfTree from "react-d3-tree/lib/types/Tree/types";
import CustomNode from "./custom_node";
import { Tool } from "../tool/tool";

const EditTree = () => {
  const treeId = document.getElementById("tree")?.getAttribute("data-tree-id");
  const initialData: types.RawNodeDatum = {
    name: "initial-root",
  };

  const { data, error } = useSWR(`/api/trees/${treeId}.json`, fetcher);
  const [nodeDatum, setNodeDatam] = useState<types.RawNodeDatum>(initialData);

  const [treeKey, setTreeKey] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const convertedData = convertNodesToRawNodeDatum(data.nodes, data.layers);
      console.log(convertedData);
      setNodeDatam(convertedData);
    }
  }, [data]);

  if (error) return <>エラーが発生しました。</>;
  if (!data) return <>ロード中…</>;

  const handleClick: typesOfTree.TreeNodeEventCallback = (node) => {
    console.log("--- handleClick start ---");
    console.log(`id:${node.data?.attributes?.id}: ${node.data.name}をクリック`);
    // クリックされたノードと同じ親ノードを持つノードのisSelectedをtrueにする
    if (typeof node.data.attributes?.id === "number") {
      const afterSelectedNodes = selectNodes(
        node.data.attributes.id,
        nodeDatum
      );
      setNodeDatam(afterSelectedNodes);
      // キーを更新してツリーを再描画
      setTreeKey(treeKey + 1);
    } else {
      console.log("idがない又はnumber型でないため処理を中断");
    }
    console.dir(nodeDatum, { depth: null });
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
          <Tree
            key={treeKey}
            translate={{ x: 350, y: 20 }}
            data={nodeDatum}
            pathFunc="diagonal"
            orientation="vertical"
            renderCustomNodeElement={CustomNode}
            onNodeClick={handleClick}
            separation={{ siblings: 2, nonSiblings: 2 }}
            zoom={0.7}
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
          <Tool />
        </div>
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
