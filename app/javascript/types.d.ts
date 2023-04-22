import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";

export type Layer = {
  id: number;
  operation: string;
  fraction: number | null;
  parent_node_id: number;
};

export type Node = {
  id: number;
  name: string;
  value: number;
  value_format: string;
  unit: string;
  is_value_locked: boolean;
  operation?: string;
  is_last_in_layer?: boolean;
  child_layer?: Layer;
  parent_id: number;
};

export type TreeStructureNode = {
  id: number;
  name: string;
  value: number;
  value_format: string;
  unit: string;
  is_value_locked: boolean;
  operation: string;
  is_last_in_layer: boolean;
  child_layer?: Layer;
  parent_id: number;
  children: TreeStructureNode[];
};

export type WrappedRawNodeDatum = RawNodeDatum & {
  attributes: {
    id: number;
    value: number;
    valueFormat: "なし" | "%" | "千" | "万";
    unit: string;
    isValueLocked: boolean;
    operation?: "たし算" | "かけ算";
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
