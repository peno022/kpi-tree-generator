import { Node, Layer } from "../../../app/javascript/types";

export {};

export const parentNode: Node = {
  id: 1,
  name: "親ノード",
  value: 300,
  value_format: "万",
  unit: "円",
  is_value_locked: true,
  parent_id: 0,
};

export const childNode1: Node = {
  id: 2,
  name: "子ノード1",
  value: 100,
  value_format: "万",
  unit: "円",
  is_value_locked: false,
  parent_id: 1,
};

export const childNode2: Node = {
  id: 3,
  name: "子ノード2",
  value: 200,
  value_format: "万",
  unit: "円",
  is_value_locked: false,
  parent_id: 1,
};

export const childLayer: Layer = {
  id: 1,
  operation: "たし算",
  fraction: null,
  parent_node_id: 1,
};

export const grandChildNode1: Node = {
  id: 4,
  name: "孫ノード1",
  value: 1000,
  value_format: "万",
  unit: "円",
  is_value_locked: false,
  parent_id: 2,
};

export const grandChildNode2: Node = {
  id: 5,
  name: "孫ノード2",
  value: 10,
  value_format: "%",
  unit: "なし",
  is_value_locked: false,
  parent_id: 2,
};

export const grandChildLayer: Layer = {
  id: 2,
  operation: "かけ算",
  fraction: null,
  parent_node_id: 2,
};
