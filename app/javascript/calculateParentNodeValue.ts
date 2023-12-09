import { Node, Layer } from "@/types";
import Big from "big.js";

export default function calculateParentNodeValue(
  parentNode: Node,
  selectedNodes: Node[],
  selectedLayer: Layer
) {
  const nodesValue = calculateNodes(selectedLayer.operation, selectedNodes);
  const fractionValue = isNaN(Number(selectedLayer.fraction))
    ? Big(0)
    : Big(selectedLayer.fraction);

  return getValueForDisplay(
    nodesValue.plus(fractionValue),
    parentNode.valueFormat
  );
}

function calculateNodes(operation: "multiply" | "add", nodes: Node[]) {
  if (operation === "multiply") {
    return nodes.reduce((acc, node) => {
      return acc.times(getValueForCalculation(node));
    }, Big(1));
  } else {
    return nodes.reduce((acc, node) => {
      return acc.plus(getValueForCalculation(node));
    }, Big(0));
  }
}

function getValueForCalculation(node: Node) {
  const nodeValue = Big(node.value);
  switch (node.valueFormat) {
    case "なし":
      return nodeValue;
    case "%":
      return nodeValue.div(100);
    case "千":
      return nodeValue.times(1000);
    case "万":
      return nodeValue.times(10000);
    default:
      return nodeValue;
  }
}

function getValueForDisplay(
  bigValue: Big,
  valueFormat: "なし" | "%" | "千" | "万"
) {
  switch (valueFormat) {
    case "なし":
      return bigValue.toNumber();
    case "%":
      return bigValue.times(100).toNumber();
    case "千":
      return bigValue.div(1000).toNumber();
    case "万":
      return bigValue.div(10000).toNumber();
    default:
      return bigValue.toNumber();
  }
}
