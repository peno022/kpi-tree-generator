import React from "react";
import { convertNodesToRawNodeDatum } from "../../../convert_nodes_list_to_raw_node_datum";
import { selectNodes } from "../../../select_nodes";
import Tree from "react-d3-tree";
import { TreeData } from "../../../types";
import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";
import { TreeNodeEventCallback } from "react-d3-tree/lib/types/Tree/types";
import CustomNode from "./custom_node";

export type TreeAreaProps = {
  treeData: TreeData;
  selectedNodeIds: number[];
  handleClick: TreeNodeEventCallback;
};

export const TreeArea: React.FC<TreeAreaProps> = ({
  treeData,
  selectedNodeIds,
  handleClick,
}) => {
  let rawNodeDatum: RawNodeDatum;
  rawNodeDatum = convertNodesToRawNodeDatum(treeData.nodes, treeData.layers);

  if (selectedNodeIds.length > 0) {
    rawNodeDatum = selectNodes(selectedNodeIds[0], rawNodeDatum);
  }

  return (
    <Tree
      translate={{ x: 350, y: 20 }}
      data={rawNodeDatum}
      pathFunc="diagonal"
      orientation="vertical"
      renderCustomNodeElement={CustomNode}
      onNodeClick={handleClick}
      separation={{ siblings: 2, nonSiblings: 2 }}
      zoom={0.7}
    />
  );
};
