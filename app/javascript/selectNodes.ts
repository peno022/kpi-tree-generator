import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";
import TreeModel from "tree-model";
import { WrappedRawNodeDatum } from "@/types";

export {};

export function selectNodes(
  clickedNodeId: number,
  rawNodeDatum: WrappedRawNodeDatum
): WrappedRawNodeDatum {
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

  const updatedTree = deepCopy(tree.model);
  return updatedTree;
}

function deepCopy<RawNodeDatum>(obj: RawNodeDatum): RawNodeDatum {
  return JSON.parse(JSON.stringify(obj));
}
