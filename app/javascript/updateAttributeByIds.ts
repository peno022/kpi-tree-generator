import TreeModel from "tree-model";
import { WrappedRawNodeDatum } from "@/types";

export {};

export function updateAttributeByIds(
  attributeName: "isSelected" | "isHovered",
  targetIds: number[],
  rawNodeDatum: WrappedRawNodeDatum
): WrappedRawNodeDatum {
  const treeModel = new TreeModel();
  const tree = treeModel.parse(rawNodeDatum);

  // ツリーのすべてのノードのattributes[attributeName]をfalseにする
  const setFalseToAllNodes = (n: TreeModel.Node<WrappedRawNodeDatum>) => {
    try {
      n.model.attributes[attributeName] = false;
      return true;
    } catch (error) {
      return false;
    }
  };
  tree.all(setFalseToAllNodes);

  // targetIdsに含まれるidを持つノードのattributes[attributeName]をtrueにする
  const setTrueToTargetNodes = (n: TreeModel.Node<WrappedRawNodeDatum>) => {
    try {
      if (targetIds.includes(n.model.attributes.id)) {
        n.model.attributes[attributeName] = true;
      }
      return true;
    } catch (error) {
      return false;
    }
  };
  tree.all(setTrueToTargetNodes);

  const updatedRawNodeDatum = deepCopy(tree.model);
  return updatedRawNodeDatum;
}

function deepCopy<WrappedRawNodeDatum>(
  obj: WrappedRawNodeDatum
): WrappedRawNodeDatum {
  return JSON.parse(JSON.stringify(obj));
}
