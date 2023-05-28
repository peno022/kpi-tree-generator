import React from "react";
import * as types from "../../types";
import RootNodeTool from "./root_node_tool";
import LayerTool from "./layer_tool";
import Message from "./message";

type ToolAreaProps = {
  treeData: types.TreeData;
  selectedNodeIds: number[];
};

const ToolArea: React.FC<ToolAreaProps> = ({ treeData, selectedNodeIds }) => {
  const allNodes = treeData.nodes;
  const allLayers = treeData.layers;

  if (selectedNodeIds.length === 0) {
    return <Message text="要素を選択すると、ここに詳細が表示されます。" />;
  }

  const selectedNodes: types.Node[] = allNodes.filter((node) =>
    selectedNodeIds.includes(node.id)
  );

  if (selectedNodes.length === 0) {
    return <Message text="選択されたノードIDが不正です。" />;
  }

  const parentNode = allNodes.find(
    (node) => node.id === selectedNodes[0].parentId
  );

  if (!parentNode) {
    return <RootNodeTool selectedRootNode={selectedNodes[0]} />;
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
      ></LayerTool>
    );
  }
};

export default ToolArea;
