import { Node, Layer, TreeData, TreeDataFromApi } from "@/types";
import calculateParentNodeValue from "@/calculateParentNodeValue";

export default function propagateSelectedNodesChangesToTree(
  selectedNodes: Node[],
  selectedLayer: Layer,
  treeData: TreeDataFromApi
): TreeData {
  const updatedTreeData: TreeData = JSON.parse(JSON.stringify(treeData));

  // selectedLayer.parentNodeIdと同じparentIdを持つノードの配列を取得する
  const siblingNodes = updatedTreeData.nodes.filter(
    (n) => n.parentId === selectedLayer.parentNodeId
  );
  // siblingNodesには含まれていて、selectedNodesには含まれていないidを持つノードを削除する
  siblingNodes.forEach((node) => {
    if (!selectedNodes.find((n) => n.id === node.id)) {
      const index = updatedTreeData.nodes.findIndex((n) => n.id === node.id);
      updatedTreeData.nodes.splice(index, 1);
    }
  });

  selectedNodes.forEach((node) => {
    if (node.id === undefined || node.id === null) {
      updatedTreeData.nodes.push(node);
    } else {
      const updatedNode = updatedTreeData.nodes.find((n) => n.id === node.id);
      if (!updatedNode) return;
      updatedNode.name = node.name;
      updatedNode.value = node.value;
      updatedNode.valueFormat = node.valueFormat;
      updatedNode.unit = node.unit;
      updatedNode.isValueLocked = node.isValueLocked;
    }
  });

  const updatedLayer = updatedTreeData.layers.find(
    (l) => l.id === selectedLayer.id
  );
  if (updatedLayer) {
    updatedLayer.operation = selectedLayer.operation;
    updatedLayer.fraction = selectedLayer.fraction;
  }

  function updateParentNode(node: Node, layer: Layer): void {
    if (node.parentId === null || node.parentId === 0) return;
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
