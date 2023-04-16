import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";
import TreeModel from "tree-model";

export {};

export function selectNodes(
  clickedNodeId: number,
  rawNodeDatum: RawNodeDatum
): RawNodeDatum {
  const treeModel = new TreeModel();
  const tree = treeModel.parse(rawNodeDatum);

  // ツリーのすべてのノードのattributes.isSelectedをfalseにする
  const resetNodeSelection = (n: TreeModel.Node<RawNodeDatum>) => {
    try {
      if (n.model.attributes) {
        n.model.attributes.isSelected = false;
      } else {
        n.model.attributes = { isSelected: false };
      }
      return true;
    } catch (error) {
      return false;
    }
  };
  tree.all(resetNodeSelection);

  // クリックしたノードとその兄弟ノードのattributes.isSelectedをtrueにする
  const clickedNode = tree.first(
    (node) => node.model.attributes.id === clickedNodeId
  );
  if (!clickedNode) {
    return tree.model;
  }
  if (clickedNode.isRoot()) {
    clickedNode.model.attributes.isSelected = true;
  } else {
    const parentNode = clickedNode.getPath().slice(-2)[0];
    parentNode.model.children.forEach((child: RawNodeDatum) => {
      if (child.attributes) {
        child.attributes.isSelected = true;
      } else {
        child.attributes = { isSelected: true };
      }
    });
  }

  return tree.model;
}
