import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";
import * as types from "./types";
import LTT from "list-to-tree";

export {};

export function convertNodesToRawNodeDatum(
  nodes: types.Node[],
  layers: types.Layer[]
): RawNodeDatum {
  const preparedNodes = prepareNodeProperties(nodes, layers);
  const treeStructureNode = convertNodesListToTree(preparedNodes);
  const rawNodeDatum =
    convertTreeStructureNodeToRawNodeDatum(treeStructureNode);

  return rawNodeDatum;
}

function prepareNodeProperties(
  nodes: types.Node[],
  layers: types.Layer[]
): types.Node[] {
  const nodesWithIsLastInLayerProperty = addIsLastInLayerProperty(nodes);
  const nodesWithChildLayer = addLayerToNode(
    nodesWithIsLastInLayerProperty,
    layers
  );
  const nodesWithInheritedOperation =
    inheritOperationFromParentNode(nodesWithChildLayer);

  return nodesWithInheritedOperation;
}

function convertNodesListToTree(nodes: types.Node[]): types.TreeStructureNode {
  // nodesのparent_idがnullの場合、parent_idを0に変更する
  nodes.forEach((node) => {
    if (node.parent_id === null) {
      node.parent_id = 0;
    }
  });

  const treeStructureNode = new LTT(nodes, {
    key_id: "id",
    key_parent: "parent_id",
    key_child: "children",
  }).GetTree();

  return treeStructureNode[0];
}

// 自分がchildrenの中の最後のノードかどうかを判定し、is_last_in_layerプロパティを追加する関数
function addIsLastInLayerProperty(nodes: types.Node[]): types.Node[] {
  nodes.forEach((node) => {
    const parentNode = findNodeById(node.parent_id, nodes);
    if (parentNode) {
      const childrenNodes = nodes.filter((n) => n.parent_id === node.parent_id);
      // childrenNodesの中で一番大きいidを持つノードが自分自身であれば、is_last_in_layerをtrueにする
      const maxId = Math.max(...childrenNodes.map((n) => n.id));
      if (node.id === maxId) {
        node.is_last_in_layer = true;
      } else {
        node.is_last_in_layer = false;
      }
    } else {
      node.is_last_in_layer = false;
    }
  });

  return nodes;
}

// Layerのparent_node_idをidに持つNodeを探し、そのNodeのプロパティにchild_layerを追加する関数
function addLayerToNode(
  nodes: types.Node[],
  layers: types.Layer[]
): types.Node[] {
  layers.forEach((layer) => {
    const parentNode = findNodeById(layer.parent_node_id, nodes);
    if (parentNode) {
      parentNode.child_layer = layer;
    }
  });

  return nodes;
}

// 親ノードのchild_layerのoperationを子ノードに引き継ぐ関数
function inheritOperationFromParentNode(nodes: types.Node[]): types.Node[] {
  nodes.forEach((node) => {
    const parentNode = findNodeById(node.parent_id, nodes);
    if (parentNode) {
      node.operation = parentNode.child_layer?.operation;
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
      valueFormat: treeStructureNode.value_format,
      unit: treeStructureNode.unit,
      isValueLocked: treeStructureNode.is_value_locked,
      operation: treeStructureNode.operation,
      isLastInLayer: treeStructureNode.is_last_in_layer,
    },
    children: treeStructureNode.children?.map((child) =>
      convertTreeStructureNodeToRawNodeDatum(child)
    ),
  };

  return rawNodeDatum;
}

// idとnodesを渡すと、そのidを持つNodeを返す関数
function findNodeById(id: number, nodes: types.Node[]): types.Node | undefined {
  return nodes.find((node) => node.id === id);
}
