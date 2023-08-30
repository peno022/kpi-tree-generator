import React from "react";
import { TreeDataFromApi, NodeFromApi } from "@/types";
import RootNodeTool from "@/components/trees/tool/RootNodeTool";
import LayerTool from "@/components/trees/tool/LayerTool";
import Message from "@/components/trees/tool/Message";

export type ToolAreaProps = {
  treeData: TreeDataFromApi;
  selectedNodeIds: number[];
  onUpdateSuccess: (updatedTreeData: TreeDataFromApi) => void;
};

export const ToolArea: React.FC<ToolAreaProps> = ({
  treeData,
  selectedNodeIds,
  onUpdateSuccess,
}) => {
  const allNodes = treeData.nodes;
  const allLayers = treeData.layers;

  if (selectedNodeIds.length === 0) {
    return <Message text="要素を選択すると、ここに詳細が表示されます。" />;
  }

  const selectedNodeIdsSet = new Set(selectedNodeIds);
  const selectedNodes: NodeFromApi[] = allNodes
    .filter((node) => selectedNodeIdsSet.has(node.id))
    .sort((a, b) => a.id - b.id);

  if (selectedNodes.length === 0) {
    return (
      <Message text="選択された要素のIDが不正です。画面を再読み込みしてもう一度お試しください。" />
    );
  }

  const parentNode = allNodes.find(
    (node) => node.id === selectedNodes[0].parentId
  );

  if (!parentNode) {
    return (
      <RootNodeTool
        selectedRootNode={selectedNodes[0]}
        onUpdateSuccess={onUpdateSuccess}
        treeData={treeData}
      />
    );
  }

  const selectedLayer = allLayers.find(
    (layer) => layer.parentNodeId === parentNode.id
  );

  if (!selectedLayer) {
    return <Message text="存在しない階層です。" />;
  } else {
    return (
      <LayerTool
        selectedNodes={selectedNodes}
        selectedLayer={selectedLayer}
        parentNode={parentNode}
        onUpdateSuccess={onUpdateSuccess}
        treeData={treeData}
      ></LayerTool>
    );
  }
};

export default ToolArea;
