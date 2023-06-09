import { Node, Layer, TreeData } from "./types";
import calculateParentNodeValue from "./calculate_parent_node_value";

export default function propagateSelectedNodesChangesToTree(
  selectedNodes: Node[],
  selectedLayer: Layer,
  treeData: TreeData
): TreeData {
  const updatedTreeData: TreeData = JSON.parse(JSON.stringify(treeData));

  function updateParentNode(node: Node, layer: Layer): void {
    if (node.parentId == null || node.parentId == 0) return;
    const parentNode = updatedTreeData.nodes.find(
      (n) => n.id === node.parentId
    );
    if (!parentNode || parentNode.isValueLocked) return;

    const siblingNodes = updatedTreeData.nodes.filter(
      (n) => n.parentId === node.parentId
    );
    const newValue = calculateParentNodeValue(parentNode, siblingNodes, layer);
    parentNode.value = newValue;

    const parentLayer = updatedTreeData.layers.find(
      (l) => l.parentNodeId === parentNode.parentId
    );
    if (parentLayer) {
      updateParentNode(parentNode, parentLayer);
    }
  }

  updateParentNode(selectedNodes[0], selectedLayer);

  return updatedTreeData;
}
