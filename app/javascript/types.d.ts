import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";

export type Layer = {
  id?: number;
  operation: "multiply" | "add";
  fraction: number;
  parentNodeId: number;
};

export type LayerFromApi = {
  id: number;
  operation: "multiply" | "add";
  fraction: number;
  parentNodeId: number;
};

export type Node = {
  id?: number;
  name: string;
  value: number;
  valueFormat: "なし" | "%" | "千" | "万";
  unit: string;
  isValueLocked: boolean;
  parentId: number;
};

export type NodeFromApi = {
  id: number;
  name: string;
  value: number;
  valueFormat: "なし" | "%" | "千" | "万";
  unit: string;
  isValueLocked: boolean;
  parentId: number;
};

export type TreeStructureNode = {
  id: number;
  name: string;
  value: number;
  valueFormat: "なし" | "%" | "千" | "万";
  unit: string;
  isValueLocked: boolean;
  operation: "multiply" | "add" | "";
  isLastInLayer: boolean;
  isSelected: boolean;
  isHovered: boolean;
  isLeaf: boolean;
  childLayer?: LayerFromApi;
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
    operation: "multiply" | "add" | "";
    isLastInLayer: boolean;
    isSelected: boolean;
    isHovered: boolean;
    isLeaf: boolean;
  };
};

export type Tree = {
  id: number;
  name: string;
};

export type TreeDataFromApi = {
  tree: Tree;
  nodes: NodeFromApi[];
  layers: LayerFromApi[];
};

export type TreeData = {
  tree: Tree;
  nodes: Node[];
  layers: Layer[];
};

export interface FieldValidationErrors {
  name: string;
  unit: string;
  value: string;
  valueFormat: string;
  isValueLocked: string;
}

export interface FieldValidationError {
  index: number;
  fieldName: "name" | "unit" | "value" | "valueFormat" | "isValueLocked";
  errorMessage: string;
}
