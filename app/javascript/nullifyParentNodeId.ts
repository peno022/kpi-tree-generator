import { Node, Layer, TreeData } from "@/types";

export default function nullifyParentNodeId(treeData: TreeData) {
  return JSON.parse(
    JSON.stringify({
      tree: treeData.tree,
      layers: nullifyParentNodeIdinLayer(treeData.layers),
      nodes: nullifyParentIdinNode(treeData.nodes),
    })
  );
}

function nullifyParentNodeIdinLayer(layers: Layer[]) {
  return layers.map((layer) => {
    return {
      ...layer,
      parentNodeId: layer.parentNodeId === 0 ? null : layer.parentNodeId,
    };
  });
}

function nullifyParentIdinNode(nodes: Node[]) {
  return nodes.map((node) => {
    return {
      ...node,
      parentId: node.parentId === 0 ? null : node.parentId,
    };
  });
}
