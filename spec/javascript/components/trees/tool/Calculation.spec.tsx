import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Calculation, {
  NodeProperty,
} from "@/components/trees/tool/calculationArea/Calculation";
import { Node, Layer } from "@/types";

const mockNode: Node = {
  id: 1,
  name: "parent",
  value: 0,
  valueFormat: "なし",
  unit: "unit",
  isValueLocked: false,
  parentId: 0,
};

const mockNodePropertis: NodeProperty = {
  id: 1,
  name: "child",
  value: 0,
  valueFormat: "なし",
  unit: "unit",
  isValueLocked: false,
  parentId: 0,
};

const mockLayerPropertis: Layer = {
  id: 1,
  operation: "multiply",
  fraction: 0,
  parentNodeId: 1,
};

describe("Calculation", () => {
  describe("バリデーションOKのとき", () => {
    describe("端数の入力がないとき", () => {
      describe("整数どうしのたし算", () => {
        it("90円 = 100円 + -10円", () => {
          const parentNode: Node = {
            ...mockNode,
            value: 1,
            unit: "円",
          };
          const selectedNodes: NodeProperty[] = [
            {
              ...mockNodePropertis,
              value: 100,
              unit: "円",
            },
            {
              ...mockNodePropertis,
              value: -10,
              unit: "円",
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };
          const inputFraction = "";
          const fractionValidation = true;
          const fractionErrorMessage = null;
          const handleFractionChange = jest.fn();
          render(
            <Calculation
              selectedNodes={selectedNodes}
              selectedLayer={selectedLayer}
              inputFraction={inputFraction}
              fractionValidation={fractionValidation}
              parentNode={parentNode}
              fractionErrorMessage={fractionErrorMessage}
              handleFractionChange={handleFractionChange}
            />
          );
          expect(
            document.getElementById("calc-member-parent")
          ).toHaveTextContent("90円");
          expect(document.getElementById("calc-member-1")).toHaveTextContent(
            "100円"
          );
          expect(document.getElementById("calc-member-2")).toHaveTextContent(
            "-10円"
          );
        });
      });
      describe("小数どうしのたし算", () => {
        it("0.3円 = 0.1円 + 0.2円", () => {
          const parentNode: Node = {
            ...mockNode,
            value: 1,
            unit: "円",
          };
          const selectedNodes: NodeProperty[] = [
            {
              ...mockNodePropertis,
              value: 0.1,
              unit: "円",
            },
            {
              ...mockNodePropertis,
              value: 0.2,
              unit: "円",
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0,
          };
          const inputFraction = "";
          const fractionValidation = true;
          const fractionErrorMessage = null;
          const handleFractionChange = jest.fn();
          render(
            <Calculation
              selectedNodes={selectedNodes}
              selectedLayer={selectedLayer}
              inputFraction={inputFraction}
              fractionValidation={fractionValidation}
              parentNode={parentNode}
              fractionErrorMessage={fractionErrorMessage}
              handleFractionChange={handleFractionChange}
            />
          );
          expect(
            document.getElementById("calc-member-parent")
          ).toHaveTextContent("0.3円");
          expect(document.getElementById("calc-member-1")).toHaveTextContent(
            "0.1円"
          );
          expect(document.getElementById("calc-member-2")).toHaveTextContent(
            "0.2円"
          );
        });
      });
      describe("かけ算", () => {
        it("10円 = 100円 × 10%", () => {
          const parentNode: Node = {
            ...mockNode,
            value: 1,
            unit: "円",
          };
          const selectedNodes: NodeProperty[] = [
            {
              ...mockNodePropertis,
              value: 100,
              unit: "円",
            },
            {
              ...mockNodePropertis,
              value: 10,
              valueFormat: "%",
              unit: "",
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 0,
          };
          const inputFraction = "";
          const fractionValidation = true;
          const fractionErrorMessage = null;
          const handleFractionChange = jest.fn();
          render(
            <Calculation
              selectedNodes={selectedNodes}
              selectedLayer={selectedLayer}
              inputFraction={inputFraction}
              fractionValidation={fractionValidation}
              parentNode={parentNode}
              fractionErrorMessage={fractionErrorMessage}
              handleFractionChange={handleFractionChange}
            />
          );
          expect(
            document.getElementById("calc-member-parent")
          ).toHaveTextContent("10円");
          expect(document.getElementById("calc-member-1")).toHaveTextContent(
            "100円"
          );
          expect(document.getElementById("calc-member-2")).toHaveTextContent(
            "10%"
          );
        });
      });
    });
    describe("端数の入力があるとき", () => {
      describe("たし算", () => {
        it("0.301円 = 0.1円 + 0.2円 + 0.001", () => {
          const parentNode: Node = {
            ...mockNode,
            value: 1,
            unit: "円",
          };
          const selectedNodes: NodeProperty[] = [
            {
              ...mockNodePropertis,
              value: 0.1,
              unit: "円",
            },
            {
              ...mockNodePropertis,
              value: 0.2,
              unit: "円",
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "add",
            fraction: 0.001,
          };
          const inputFraction = "";
          const fractionValidation = true;
          const fractionErrorMessage = null;
          const handleFractionChange = jest.fn();
          render(
            <Calculation
              selectedNodes={selectedNodes}
              selectedLayer={selectedLayer}
              inputFraction={inputFraction}
              fractionValidation={fractionValidation}
              parentNode={parentNode}
              fractionErrorMessage={fractionErrorMessage}
              handleFractionChange={handleFractionChange}
            />
          );
          expect(
            document.getElementById("calc-member-parent")
          ).toHaveTextContent("0.301円");
          expect(document.getElementById("calc-member-1")).toHaveTextContent(
            "0.1円"
          );
          expect(document.getElementById("calc-member-2")).toHaveTextContent(
            "0.2円"
          );
        });
      });
      describe("かけ算", () => {
        it("11円 = 100円 × 10% + 1", () => {
          const parentNode: Node = {
            ...mockNode,
            value: 1,
            unit: "円",
          };
          const selectedNodes: NodeProperty[] = [
            {
              ...mockNodePropertis,
              value: 100,
              unit: "円",
            },
            {
              ...mockNodePropertis,
              value: 10,
              valueFormat: "%",
              unit: "",
            },
          ];

          const selectedLayer: Layer = {
            ...mockLayerPropertis,
            operation: "multiply",
            fraction: 1,
          };
          const inputFraction = "";
          const fractionValidation = true;
          const fractionErrorMessage = null;
          const handleFractionChange = jest.fn();
          render(
            <Calculation
              selectedNodes={selectedNodes}
              selectedLayer={selectedLayer}
              inputFraction={inputFraction}
              fractionValidation={fractionValidation}
              parentNode={parentNode}
              fractionErrorMessage={fractionErrorMessage}
              handleFractionChange={handleFractionChange}
            />
          );
          expect(
            document.getElementById("calc-member-parent")
          ).toHaveTextContent("11円");
          expect(document.getElementById("calc-member-1")).toHaveTextContent(
            "100円"
          );
          expect(document.getElementById("calc-member-2")).toHaveTextContent(
            "10%"
          );
        });
      });
    });
  });
  describe("バリデーションNGのとき", () => {
    it("子要素の数値が空白のとき、計算上0として扱われる", () => {
      const parentNode: Node = {
        ...mockNode,
        value: 1,
        unit: "円",
      };
      const selectedNodes: NodeProperty[] = [
        {
          ...mockNodePropertis,
          value: "",
          unit: "円",
        },
        {
          ...mockNodePropertis,
          value: "",
          unit: "円",
        },
      ];

      const selectedLayer: Layer = {
        ...mockLayerPropertis,
        operation: "add",
        fraction: 0,
      };
      const inputFraction = "";
      const fractionValidation = true;
      const fractionErrorMessage = null;
      const handleFractionChange = jest.fn();
      render(
        <Calculation
          selectedNodes={selectedNodes}
          selectedLayer={selectedLayer}
          inputFraction={inputFraction}
          fractionValidation={fractionValidation}
          parentNode={parentNode}
          fractionErrorMessage={fractionErrorMessage}
          handleFractionChange={handleFractionChange}
        />
      );
      expect(document.getElementById("calc-member-parent")).toHaveTextContent(
        "0円"
      );
    });
  });
});
