import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";

export type Layer = {
  id: number;
  operation: "multiply" | "add";
  fraction: number | null;
  parentNodeId: number;
};

export type Node = {
  id: number;
  name: string;
  value: number;
  valueFormat: "なし" | "%" | "千" | "万";
  unit: string;
  isValueLocked: boolean;
  operation?: string;
  isLastInLayer?: boolean;
  childLayer?: Layer;
  parentId: number;
};

export type TreeStructureNode = {
  id: number;
  name: string;
  value: number;
  valueFormat: "なし" | "%" | "千" | "万";
  unit: string;
  isValueLocked: boolean;
  operation: string;
  isLastInLayer: boolean;
  childLayer?: Layer;
  parentId: number;
  children: TreeStructureNode[];
};

export type WrappedRawNodeDatum = RawNodeDatum & {
  attributes: {
    id: number;
    value: number;
    valueFormat: "なし" | "%" | "千" | "万";
    unit: string;
    isValueLocked: boolean;
    operation?: "multiply" | "add";
    isLastInLayer: boolean;
  };
};

export type Tree = {
  id: number;
  name: string;
};

export type TreeData = {
  tree: Tree;
  nodes: Node[];
  layers: Layer[];
};
