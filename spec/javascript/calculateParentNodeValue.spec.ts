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
      });
      describe("fractionがありの場合", () => {
        it("2 * 3 + 0.1 = 6.1 になること", () => {
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
            fraction: 0.1,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(6.1);
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
        it("3.1 + 5.2 = 8.3 になること", () => {
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
            fraction: 0,
          };

          const result = calculateParentNodeValue(
            parentNode,
            selectedNodes,
            selectedLayer
          );
          expect(result).toBe(8.3);
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
