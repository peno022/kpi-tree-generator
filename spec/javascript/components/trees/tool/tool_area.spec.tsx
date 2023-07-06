import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  ToolArea,
  ToolAreaProps,
} from "../../../../../app/javascript/components/trees/tool/tool_area";
import * as fixtures from "../../../__fixtures__/sample_data";

describe("ノードが選択されていないとき", () => {
  it("'要素を選択すると、ここに詳細が表示されます。'というテキストが表示されること", () => {
    const toolAreaProps: ToolAreaProps = {
      treeData: fixtures.treeData,
      selectedNodeIds: [],
      onUpdateSuccess: jest.fn(),
    };
    render(<ToolArea {...toolAreaProps} />);
    expect(
      screen.getByText("要素を選択すると、ここに詳細が表示されます。")
    ).toBeInTheDocument();
  });
});

describe("正常なデータでは起きないはずのエラー", () => {
  describe("選択したノードIDに該当するノードがツリーに存在しないとき", () => {
    it("'選択されたノードIDが不正です。'というテキストが表示されること", () => {
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [999999, 9999999],
        onUpdateSuccess: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);
      expect(
        screen.getByText("選択されたノードIDが不正です。")
      ).toBeInTheDocument();
    });
  });
  describe("選択したノードが含まれるレイヤーがツリーに存在しないとき", () => {
    it("'存在しない階層です。'というテキストが表示されること", () => {
      const treeDataWithoutLayers = {
        tree: fixtures.treeData.tree,
        nodes: fixtures.treeData.nodes,
        layers: [],
      };
      const toolAreaProps: ToolAreaProps = {
        treeData: treeDataWithoutLayers,
        selectedNodeIds: [2, 3],
        onUpdateSuccess: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);
      expect(screen.getByText("存在しない階層です。")).toBeInTheDocument();
    });
  });
});

describe("選択したノードが子ノードのとき", () => {
  describe("初期表示時", () => {
    it("要素間の関係が表示されていること", () => {
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [2, 3], // 子ノード1と子ノード2を選択
        onUpdateSuccess: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);

      expect(screen.getByText("要素間の関係")).toBeInTheDocument();
      const multiplyButton = screen.getByRole("button", { name: "かけ算" });
      expect(multiplyButton).toBeInTheDocument();
      expect(multiplyButton).toHaveClass(
        "bg-base-200 text-base-300 border border-base-200"
      );
      const addButton = screen.getByRole("button", { name: "たし算" });
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveClass("bg-base-100 border border-neutral");
    });

    it("親子ノード間の計算式が表示されていること", () => {
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [2, 3], // 子ノード1と子ノード2を選択
        onUpdateSuccess: jest.fn(),
      };
      const { container } = render(<ToolArea {...toolAreaProps} />);

      // calculationクラスを持つdiv要素の子要素に、計算式の各要素が表示されていることを確認する
      // containerを使うべきではない？（ｓcreenを使うべき？）
      const calculationDiv = container.querySelector(".calculation");
      if (!calculationDiv) {
        throw new Error("calculationDiv is null");
      }
      expect(calculationDiv).toHaveTextContent("親ノード");
      expect(calculationDiv).toHaveTextContent("300万円");
      expect(calculationDiv).toHaveTextContent("子ノード1");
      expect(calculationDiv).toHaveTextContent("100万円");
      expect(calculationDiv).toHaveTextContent("子ノード2");
      expect(calculationDiv).toHaveTextContent("200万円");
      expect(calculationDiv).toHaveTextContent("端数");
      expect(calculationDiv).toHaveTextContent("0");
      expect(calculationDiv.getElementsByClassName("fa-equals").length).toBe(1);
      expect(calculationDiv.getElementsByClassName("fa-plus").length).toBe(2);
    });

    it("ノード詳細が表示されていること", () => {
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [2, 3], // 子ノード1と子ノード2を選択
        onUpdateSuccess: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);

      const nameInputs = screen.getAllByRole("textbox", { name: "名前" });
      expect(nameInputs.length).toBe(2);
      expect(nameInputs[0]).toHaveValue("子ノード1");
      expect(nameInputs[1]).toHaveValue("子ノード2");
      const unitInputs = screen.getAllByRole("textbox", { name: "単位" });
      expect(unitInputs.length).toBe(2);
      expect(unitInputs[0]).toHaveValue("円");
      expect(unitInputs[1]).toHaveValue("円");
      const valueInputs = screen.getAllByRole("textbox", { name: "数値" });
      expect(valueInputs.length).toBe(2);
      expect(valueInputs[0]).toHaveValue("100");
      expect(valueInputs[1]).toHaveValue("200");
      const valueFormatDropdowns = screen.getAllByRole("combobox", {
        name: "表示形式",
      });
      expect(valueFormatDropdowns.length).toBe(2);
      expect(valueFormatDropdowns[0]).toHaveValue("万");
      expect(valueFormatDropdowns[1]).toHaveValue("万");
      const isValueLockedCheckboxes = screen.getAllByRole("checkbox", {
        name: "数値を自動更新しない",
      });
      expect(isValueLockedCheckboxes.length).toBe(2);
      expect(isValueLockedCheckboxes[0]).not.toBeChecked();
      expect(isValueLockedCheckboxes[1]).not.toBeChecked();
    });

    it("要素を追加ボタンが表示されていること", () => {
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [2, 3], // 子ノード1と子ノード2を選択
        onUpdateSuccess: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);

      expect(
        screen.getByRole("button", { name: "要素を追加" })
      ).toBeInTheDocument();
    });

    it("更新ボタンがアクティブな状態で表示されていること", () => {
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [2, 3], // 子ノード1と子ノード2を選択
        onUpdateSuccess: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);

      const updateButton = screen.getByLabelText("更新");
      expect(updateButton).toBeInTheDocument();
      expect(updateButton).not.toHaveClass("btn-disabled");
    });
  });
});
