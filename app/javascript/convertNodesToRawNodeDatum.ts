import * as types from "@/types";
import LTT from "list-to-tree";
import calculateParentNodeValue from "@/calculateParentNodeValue";

export {};

type preparedNode = types.NodeFromApi & {
  operation?: string;
  isLastInLayer: boolean;
  isSelected: boolean;
  isHovered: boolean;
  isLeaf: boolean;
  hasInconsistentValue: boolean;
  childLayer?: types.LayerFromApi;
};

export function convertNodesToRawNodeDatum(
  nodes: types.NodeFromApi[],
  layers: types.LayerFromApi[]
): types.WrappedRawNodeDatum {
  const preparedNodes = prepareNodeProperties(nodes, layers);
  const treeStructureNode = convertNodesListToTree(preparedNodes);
  const rawNodeDatum =
    convertTreeStructureNodeToRawNodeDatum(treeStructureNode);
    
  return rawNodeDatum;
}

function prepareNodeProperties(
  nodes: types.NodeFromApi[],
  layers: types.LayerFromApi[]
): preparedNode[] {
  const nodesWithDisplayProperties = addDisplayProperties(nodes, layers);
  const nodesWithChildLayer = addLayerToNode(
    nodesWithDisplayProperties,
    layers
  );
  const nodesWithInheritedOperation =
    inheritOperationFromParentNode(nodesWithChildLayer);

  return nodesWithInheritedOperation;
}

function convertNodesListToTree(
  nodes: preparedNode[]
): types.TreeStructureNode {
  // nodesのparentIdがnullの場合、parentIdを0に変更する
  nodes.forEach((node) => {
    if (node.parentId === null) {
      node.parentId = 0;
    }
  });

  const treeStructureNode = new LTT(nodes, {
    key_id: "id",
    key_parent: "parentId",
    key_child: "children",
  }).GetTree();

  return treeStructureNode[0];
}

function addDisplayProperties(
  nodes: types.NodeFromApi[],
  layers: types.LayerFromApi[]
): preparedNode[] {
  return nodes.map((node) => {
    const nodeWithDisplayProperties = {
      ...node,
      isLastInLayer: false,
      isSelected: false,
      isHovered: false,
      isLeaf: false,
      hasInconsistentValue: false,
    };
    const parentNode = nodes.find((n) => n.id === node.parentId);
    const layer = layers.find((l) => l.parentNodeId === node.parentId);

    if (parentNode && layer) {
      const siblings = nodes.filter((n) => n.parentId === node.parentId);
      // siblingsの中で一番大きいidを持つノードが自分自身であれば、isLastInLayerをtrueにする
      const maxId = Math.max(...siblings.map((n) => n.id));
      if (node.id === maxId) {
        nodeWithDisplayProperties.isLastInLayer = true;
      } else {
        nodeWithDisplayProperties.isLastInLayer = false;
      }
      if (
        parentNode.value ===
        calculateParentNodeValue(parentNode, siblings, layer)
      ) {
        nodeWithDisplayProperties.hasInconsistentValue = false;
      } else {
        nodeWithDisplayProperties.hasInconsistentValue = true;
      }
    } else {
      nodeWithDisplayProperties.isLastInLayer = true;
      nodeWithDisplayProperties.hasInconsistentValue = false;
    }

    return nodeWithDisplayProperties;
  });
}

// LayerのparentNodeIdをidに持つNodeを探し、そのNodeのプロパティにchildLayerを追加する関数
function addLayerToNode(
  nodes: preparedNode[],
  layers: types.LayerFromApi[]
): preparedNode[] {
  layers.forEach((layer) => {
    const parentNode = findNodeById(layer.parentNodeId, nodes);
    if (parentNode) {
      parentNode.childLayer = layer;
    }
  });

  return nodes;
}

// 親ノードのchildLayerのoperationを子ノードに引き継ぐ関数
function inheritOperationFromParentNode(nodes: preparedNode[]): preparedNode[] {
  nodes.forEach((node) => {
    const parentNode = findNodeById(node.parentId, nodes);
    if (parentNode) {
      node.operation = parentNode.childLayer?.operation;
    } else {
      node.operation = "";
    }
  });

  return nodes;
}

// nodeTreeをRawNodeDatum型に変換する関数
function convertTreeStructureNodeToRawNodeDatum(
  treeStructureNode: types.TreeStructureNode
): types.WrappedRawNodeDatum {
  const rawNodeDatum = {
    name: treeStructureNode.name,
    attributes: {
      id: treeStructureNode.id,
      value: treeStructureNode.value,
      valueFormat: treeStructureNode.valueFormat,
      unit: treeStructureNode.unit,
      isValueLocked: treeStructureNode.isValueLocked,
      operation: treeStructureNode.operation,
      isLastInLayer: treeStructureNode.isLastInLayer,
      isSelected: treeStructureNode.isSelected,
      isHovered: treeStructureNode.isHovered,
      isLeaf: !!(
        !treeStructureNode.children || treeStructureNode.children.length === 0
      ),
      hasInconsistentValue: treeStructureNode.hasInconsistentValue,
    },
    children: treeStructureNode.children?.map((child) =>
      convertTreeStructureNodeToRawNodeDatum(child)
    ),
  };

  return rawNodeDatum;
}

// idとnodesを渡すと、そのidを持つNodeを返す関数
function findNodeById(
  id: number,
  nodes: preparedNode[]
): preparedNode | undefined {
  return nodes.find((node) => node.id === id);
}
