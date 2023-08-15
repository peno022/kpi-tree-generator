import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";
import * as types from "@/types";
import LTT from "list-to-tree";

export {};

type preparedNode = types.NodeFromApi & {
  operation?: string;
  isLastInLayer?: boolean;
  childLayer?: types.LayerFromApi;
};

export function convertNodesToRawNodeDatum(
  nodes: types.NodeFromApi[],
  layers: types.LayerFromApi[]
): RawNodeDatum {
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
  const nodesWithIsLastInLayerProperty = addIsLastInLayerProperty(nodes);
  const nodesWithChildLayer = addLayerToNode(
    nodesWithIsLastInLayerProperty,
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

// 自分がchildrenの中の最後のノードかどうかを判定し、isLastInLayerプロパティを追加する関数
function addIsLastInLayerProperty(nodes: types.NodeFromApi[]): preparedNode[] {
  return nodes.map((node) => {
    const nodeWithIsLastInLayerProperty = { ...node, isLastInLayer: false };
    const parentNode = findNodeById(node.parentId, nodes);
    if (parentNode) {
      const childrenNodes = nodes.filter((n) => n.parentId === node.parentId);
      // childrenNodesの中で一番大きいidを持つノードが自分自身であれば、isLastInLayerをtrueにする
      const maxId = Math.max(...childrenNodes.map((n) => n.id));
      if (node.id === maxId) {
        nodeWithIsLastInLayerProperty.isLastInLayer = true;
      } else {
        nodeWithIsLastInLayerProperty.isLastInLayer = false;
      }
    } else {
      nodeWithIsLastInLayerProperty.isLastInLayer = true;
    }
    return nodeWithIsLastInLayerProperty;
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
): RawNodeDatum {
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
