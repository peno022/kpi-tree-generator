export type Layer = {
  id: number;
  operation: string;
  fraction: number | null;
  parent_node_id: number;
  tree_id: number;
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

export type Tree = {
  id: number;
  name: string;
};

export type TreeData = {
  tree: Tree;
  nodes: Node[];
  layers: Layer[];
};
