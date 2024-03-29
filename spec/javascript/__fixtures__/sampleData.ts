import { NodeFromApi, LayerFromApi, Tree, TreeDataFromApi } from "@/types";

export {};

export const tree: Tree = {
  id: 1,
  name: "ツリー1",
};

export const parentNode: NodeFromApi = {
  id: 1,
  name: "親ノード",
  value: 300,
  valueFormat: "万",
  unit: "円",
  isValueLocked: true,
  parentId: 0,
};

export const childNode1: NodeFromApi = {
  id: 2,
  name: "子ノード1",
  value: 100,
  valueFormat: "万",
  unit: "円",
  isValueLocked: false,
  parentId: 1,
};

export const childNode2: NodeFromApi = {
  id: 3,
  name: "子ノード2",
  value: 200,
  valueFormat: "万",
  unit: "円",
  isValueLocked: false,
  parentId: 1,
};

export const childLayer: LayerFromApi = {
  id: 1,
  operation: "add",
  fraction: 0,
  parentNodeId: 1,
};

export const grandChildNode1: NodeFromApi = {
  id: 4,
  name: "孫ノード1",
  value: 1000,
  valueFormat: "万",
  unit: "円",
  isValueLocked: false,
  parentId: 2,
};

export const grandChildNode2: NodeFromApi = {
  id: 5,
  name: "孫ノード2",
  value: 10,
  valueFormat: "%",
  unit: "なし",
  isValueLocked: false,
  parentId: 2,
};

export const grandChildLayer: LayerFromApi = {
  id: 2,
  operation: "multiply",
  fraction: 0,
  parentNodeId: 2,
};

export const greatGrandChildNode1: NodeFromApi = {
  id: 6,
  name: "ひ孫ノード1",
  value: 950,
  valueFormat: "万",
  unit: "円",
  isValueLocked: false,
  parentId: 4,
};

export const greatGrandChildNode2: NodeFromApi = {
  id: 7,
  name: "ひ孫ノード2",
  value: 20,
  valueFormat: "万",
  unit: "なし",
  isValueLocked: false,
  parentId: 4,
};

export const greatGrandChildNode3: NodeFromApi = {
  id: 8,
  name: "ひ孫ノード3",
  value: 30,
  valueFormat: "万",
  unit: "なし",
  isValueLocked: false,
  parentId: 4,
};

export const greatGrandChildLayer: LayerFromApi = {
  id: 3,
  operation: "add",
  fraction: 0,
  parentNodeId: 4,
};

export const treeData: TreeDataFromApi = {
  tree,
  nodes: [
    parentNode,
    childNode1,
    childNode2,
    grandChildNode1,
    grandChildNode2,
    greatGrandChildNode1,
    greatGrandChildNode2,
    greatGrandChildNode3,
  ],
  layers: [childLayer, grandChildLayer, greatGrandChildLayer],
};
