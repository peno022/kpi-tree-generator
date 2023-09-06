import React, { useState, useEffect } from "react";
import { convertNodesToRawNodeDatum } from "@/convertNodesToRawNodeDatum";
import { selectNodes } from "@/selectNodes";
import Tree from "react-d3-tree";
import {
  TreeDataFromApi,
  WrappedRawNodeDatum,
  TreeData,
  Node,
  Layer,
} from "@/types";
import { TreeNodeEventCallback } from "react-d3-tree/lib/types/Tree/types";
import CustomNode from "@/components/trees/tree/CustomNode";
import { updateAttributeByIds } from "@/updateAttributeByIds";
import { useTreeUpdate } from "@/hooks/useTreeUpdate";
import AlertError from "@/components/shared/AlertError";
import { RenderCustomNodeElementFn } from "react-d3-tree/lib/types/types/common";

export type TreeAreaProps = {
  treeData: TreeDataFromApi;
  selectedNodeIds: number[];
  handleClick: TreeNodeEventCallback;
  onUpdateSuccess: (
    updatedTreeData: TreeDataFromApi,
    selectedNodeIds?: number[]
  ) => void;
  onUpdateStatusChange: (isUpdating: boolean) => void;
};

export const TreeArea: React.FC<TreeAreaProps> = ({
  treeData,
  selectedNodeIds,
  handleClick,
  onUpdateSuccess,
  onUpdateStatusChange,
}) => {
  const { errorMessage, sendUpdateRequest, setErrorMessage, isUpdating } =
    useTreeUpdate(treeData.tree.id);
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);

  useEffect(() => {
    onUpdateStatusChange(isUpdating);
  }, [isUpdating]);

  let rawNodeDatum: WrappedRawNodeDatum;
  rawNodeDatum = convertNodesToRawNodeDatum(treeData.nodes, treeData.layers);

  if (selectedNodeIds.length > 0) {
    rawNodeDatum = selectNodes(selectedNodeIds[0], rawNodeDatum);
  }

  const targetNodeIds: number[] = hoveredNodeId !== null ? [hoveredNodeId] : [];
  rawNodeDatum = updateAttributeByIds("isHovered", targetNodeIds, rawNodeDatum);

  const createNewChildLayerAndNodes = async (parentNodeId: number) => {
    setErrorMessage(null);
    console.log("createNewChildLayerAndNodes");
    const newChildLayer: Layer = {
      operation: "multiply",
      fraction: 0,
      parentNodeId,
    };
    const newChildNode: Node = {
      name: "新規の要素",
      value: 1,
      valueFormat: "なし",
      unit: "",
      isValueLocked: false,
      parentId: parentNodeId,
    };
    const newTreeData: TreeData = {
      ...treeData,
      layers: [...treeData.layers, newChildLayer],
      nodes: [...treeData.nodes, { ...newChildNode }, { ...newChildNode }],
    };
    const result = await sendUpdateRequest(newTreeData);
    if (result) {
      console.log("createNewChildLayerAndNodes success");
      console.dir(result);
      const newNodeIds = result.nodes
        .filter((node) => node.parentId === parentNodeId)
        .map((node) => node.id);
      onUpdateSuccess(result, newNodeIds);
    }
  };

  const handleMouseOver: TreeNodeEventCallback = (node) => {
    const hoveredNode = treeData.nodes.find(
      (nodeData) => nodeData.id === node.data?.attributes?.id
    );
    if (!hoveredNode) {
      return;
    }
    setHoveredNodeId(hoveredNode.id);
  };

  const handleMouseOut: TreeNodeEventCallback = () => {
    setHoveredNodeId(null);
  };

  const CustomNodeWrapper: RenderCustomNodeElementFn = (rd3tNodeProps) => {
    return (
      <CustomNode
        {...rd3tNodeProps}
        createNewChildLayerAndNodes={createNewChildLayerAndNodes}
      />
    );
  };

  return (
    <>
      {errorMessage && <AlertError message={errorMessage} />}
      <Tree
        translate={{ x: 350, y: 20 }}
        data={rawNodeDatum}
        pathFunc="diagonal"
        orientation="vertical"
        renderCustomNodeElement={CustomNodeWrapper}
        onNodeClick={handleClick}
        separation={{ siblings: 2, nonSiblings: 2 }}
        zoom={0.7}
        onNodeMouseOver={handleMouseOver}
        onNodeMouseOut={handleMouseOut}
      />
    </>
  );
};
