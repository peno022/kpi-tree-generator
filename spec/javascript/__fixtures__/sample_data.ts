import { Node, Layer } from "../../../app/javascript/types";

export {};

export const parentNode: Node = {
  id: 1,
  name: "親ノード",
  value: 300,
  valueFormat: "万",
  unit: "円",
  isValueLocked: true,
  parentId: 0,
};

export const childNode1: Node = {
  id: 2,
  name: "子ノード1",
  value: 100,
  valueFormat: "万",
  unit: "円",
  isValueLocked: false,
  parentId: 1,
};

export const childNode2: Node = {
  id: 3,
  name: "子ノード2",
  value: 200,
  valueFormat: "万",
  unit: "円",
  isValueLocked: false,
  parentId: 1,
};

export const childLayer: Layer = {
  id: 1,
  operation: "add",
  fraction: 0,
  parentNodeId: 1,
};

export const grandChildNode1: Node = {
  id: 4,
  name: "孫ノード1",
  value: 1000,
  valueFormat: "万",
  unit: "円",
  isValueLocked: false,
  parentId: 2,
};

export const grandChildNode2: Node = {
  id: 5,
  name: "孫ノード2",
  value: 10,
  valueFormat: "%",
  unit: "なし",
  isValueLocked: false,
  parentId: 2,
};

export const grandChildLayer: Layer = {
  id: 2,
  operation: "multiply",
  fraction: 0,
  parentNodeId: 2,
};

export const greatGrandChildNode1: Node = {
  id: 6,
  name: "ひ孫ノード1",
  value: 950,
  valueFormat: "万",
  unit: "円",
  isValueLocked: false,
  parentId: 4,
};

export const greatGrandChildNode2: Node = {
  id: 7,
  name: "ひ孫ノード2",
  value: 20,
  valueFormat: "万",
  unit: "なし",
  isValueLocked: false,
  parentId: 4,
};

export const greatGrandChildNode3: Node = {
  id: 8,
  name: "ひ孫ノード3",
  value: 30,
  valueFormat: "万",
  unit: "なし",
  isValueLocked: false,
  parentId: 4,
};

export const greatGrandChildLayer: Layer = {
  id: 3,
  operation: "add",
  fraction: 0,
  parentNodeId: 4,
};
