/**
 * @jest-environment node
 */

import calculateParentNodeValue from "@/calculateParentNodeValue";
import { Node, Layer } from "@/types";

const mockNodePropertis = {
  id: 1,
  name: "name",
  value: 0,
  valueFormat: "なし",
  unit: "unit",
  isValueLocked: false,
  parentId: 0,
};

const mockLayerPropertis = {
  id: 1,
  operation: "multiply",
  fraction: 0,
  parentNodeId: 1,
};

describe("calculateParentNodeValue", () => {
  describe("operationがmultiplyの場合", () => {
    describe("valueFormatがなしの場合", () => {
      describe("fractionがなしの場合", () => {
        it("2 * 3 = 6 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 2,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 3,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(6);
        });
        it("-2 * 3 = -6 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -2,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 3,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-6);
        });
        it("0.1 * 3 = 0.3 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 3,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0.3);
        });
        it("-0.1 * 3 = -0.3 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -0.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 3,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-0.3);
        });
        it("0 * 3 = 0 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 3,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0);
        });
        it("-3 * -4 = 12 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -3,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -4,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(12);
        });
        it("-3 * 0.1 = -0.3 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -3,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.1,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-0.3);
        });
        it("-3 * -0.1 = 0.3 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -3,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -0.1,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0.3);
        });
        it("-3 * 0 = 0 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -3,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0);
        });
        it("0.1 * 0.1 = 0.01 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.1,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0.01);
        });
        it("0.1 * -0.1 = -0.01 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -0.1,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-0.01);
        });
        it("0.1 * 0 = 0 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0);
        });
        it("-0.1 * -0.1 = 0.01 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -0.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -0.1,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0.01);
        });
        it("-0.1 * 0 = 0 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -0.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0);
        });
        it("0 * 0 = 0 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
            value: 0,
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0);
        });
      });
      describe("fractionがありの場合", () => {
        it("0.2 * 0.3 + 1 = 1.06 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.2,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.3,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 1,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(1.06);
        });
        it("0.2 * 0.3 + (-1) = -0.94 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.2,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.3,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: -1,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-0.94);
        });
        it("0.2 * 0.3 + 0.1 = 0.16 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.2,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.3,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0.1,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0.16);
        });
        it("0.2 * 0.3 + (-0.1) = -0.04 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.2,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.3,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: -0.1,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-0.04);
        });
      });
    });
    describe("valueFormatがありの場合", () => {
      describe("fractionがなしの場合", () => {
        it("2万 * 10% = 2千 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "千",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "万",
              value: 2,
            },
            {
              ...mockNodePropertis,
              valueFormat: "%",
              value: 10,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(2);
        });
      });
      describe("fractionがありの場合", () => {
        it("2万 * 10% + 100 = 2.1千 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "千",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "万",
              value: 2,
            },
            {
              ...mockNodePropertis,
              valueFormat: "%",
              value: 10,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 100,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(2.1);
        });
      });
    });
  });
  describe("operationがaddの場合", () => {
    describe("valueFormatがなしの場合", () => {
      describe("fractionがなしの場合", () => {
        it("10 + 25 = 35 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 10,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 25,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(35);
        });
        it("10 + (-25) = -15 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 10,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -25,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-15);
        });
        it("10 + 0.1 = 10.1 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 10,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.1,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(10.1);
        });
        it("10 + (-0.1) = 9.9 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 10,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -0.1,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(9.9);
        });
        it("10 + 0 = 10 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 10,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(10);
        });
        it("-10 + (-5) = -15 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -10,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -5,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-15);
        });
        it("-10 + 0.1 = -9.9 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -10,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.1,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-9.9);
        });
        it("-10 + (-0.1) = -10.1 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -10,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -0.1,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-10.1);
        });
        it("-10 + 0 = -10 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -10,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-10);
        });
        it("0.1 + 0.2 = 0.3 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.2,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0.3);
        });
        it("0.1 + (-0.2) = -0.1 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -0.2,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-0.1);
        });
        it("0.1 + 0 = 0.1 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0.1);
        });
        it("-0.1 + (-0.2) = -0.3 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -0.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -0.2,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-0.3);
        });
        it("-0.1 + 0 = -0.1 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: -0.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(-0.1);
        });
        it("0 + 0 = 0 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 0,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(0);
        });
      });
      describe("fractionがありの場合", () => {
        it("3.1 + 5.2 + 0.01 = 8.31 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "なし",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 3.1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "なし",
              value: 5.2,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0.01,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(8.31);
        });
      });
    });
    describe("valueFormatがありの場合", () => {
      describe("fractionがなしの場合", () => {
        it("1万 + 5千 = 15千 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "千",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "万",
              value: 1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "千",
              value: 5,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(15);
        });
      });
      describe("fractionがありの場合", () => {
        it("1万 + 5千 + 1 = 15.001千 になること", () => {
          const parentNode: Node = {
            ...mockNodePropertis,
            valueFormat: "千",
          };

          const selectedNodes: Node[] = [
            {
              ...mockNodePropertis,
              valueFormat: "万",
              value: 1,
            },
            {
              ...mockNodePropertis,
              valueFormat: "千",
              value: 5,
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 1,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(15.001);
        });
      });
    });
  });
});
