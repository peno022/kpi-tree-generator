import React, { useState } from "react";
import { convertNodesToRawNodeDatum } from "@/convertNodesToRawNodeDatum";
import { selectNodes } from "@/selectNodes";
import Tree from "react-d3-tree";
import { TreeDataFromApi, WrappedRawNodeDatum } from "@/types";
import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";
import { TreeNodeEventCallback } from "react-d3-tree/lib/types/Tree/types";
import CustomNode from "@/components/trees/tree/CustomNode";
import { updateAttributeByIds } from "@/updateAttributeByIds";

export type TreeAreaProps = {
  treeData: TreeDataFromApi;
  selectedNodeIds: number[];
  handleClick: TreeNodeEventCallback;
  hoveredNodeId: number | null;
  handleMouseOver: TreeNodeEventCallback;
  handleMouseOut: TreeNodeEventCallback;
};

export const TreeArea: React.FC<TreeAreaProps> = ({
  treeData,
  selectedNodeIds,
  handleClick,
  hoveredNodeId,
  handleMouseOver,
  handleMouseOut,
}) => {
  let rawNodeDatum: WrappedRawNodeDatum;
  rawNodeDatum = convertNodesToRawNodeDatum(treeData.nodes, treeData.layers);

  if (selectedNodeIds.length > 0) {
    rawNodeDatum = selectNodes(selectedNodeIds[0], rawNodeDatum);
  }

  const targetNodeIds: number[] = hoveredNodeId !== null ? [hoveredNodeId] : [];
  rawNodeDatum = updateAttributeByIds("isHovered", targetNodeIds, rawNodeDatum);

  return (
    <>
      <Tree
        translate={{ x: 350, y: 20 }}
        data={rawNodeDatum}
        pathFunc="diagonal"
        orientation="vertical"
        renderCustomNodeElement={CustomNode}
        onNodeClick={handleClick}
        separation={{ siblings: 2, nonSiblings: 2 }}
        zoom={0.7}
        onNodeMouseOver={handleMouseOver}
        onNodeMouseOut={handleMouseOut}
      />
    </>
  );
};
