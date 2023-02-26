export type Tree = {
  id: number;
  name: string;
  root: Node;
};

export type Node = {
  id: number;
  name: string;
  value: number;
  value_format: string;
  unit: string;
  is_value_locked: boolean;
  child_layer?: Layer;
  children?: Node[];
};

export type Layer = {
  id: number;
  operation: string;
  fraction?: number;
};
