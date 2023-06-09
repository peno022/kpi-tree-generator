import { Node, Layer } from "./types";

export default function calculateParentNodeValue(
  parentNode: Node,
  selectedNodes: Node[],
  selectedLayer: Layer
) {
  return getValueForDisplay(
    calculateNodes(selectedLayer.operation, selectedNodes) +
      (selectedLayer.fraction ?? 0),
    parentNode.valueFormat
  );
}

function calculateNodes(operation: "multiply" | "add", nodes: Node[]) {
  if (operation === "multiply") {
    return nodes.reduce((acc, node) => {
      return acc * getValueForCalculation(node);
    }, 1);
  } else {
    return nodes.reduce((acc, node) => {
      return acc + getValueForCalculation(node);
    }, 0);
  }
}

function getValueForCalculation(node: Node) {
  switch (node.valueFormat) {
    case "なし":
      return node.value;
    case "%":
      return node.value / 100;
    case "千":
      return node.value * 1000;
    case "万":
      return node.value * 10000;
    default:
      return node.value;
  }
}

function getValueForDisplay(
  value: number,
  valueFormat: "なし" | "%" | "千" | "万"
) {
  switch (valueFormat) {
    case "なし":
      return value;
    case "%":
      return value * 100;
    case "千":
      return value / 1000;
    case "万":
      return value / 10000;
    default:
      return value;
  }
}
