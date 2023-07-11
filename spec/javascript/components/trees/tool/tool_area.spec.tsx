import React from "react";
import { render, screen } from "@testing-library/react"; // TODO:エラー解消方法の調査
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event"; // TODO:エラー解消方法の調査
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

      // TODO:
    });
  });
  describe("更新を実行する時", () => {
    it("更新ボタンを押した後にモーダル上の「更新する」ボタンを押すと更新処理を呼ぶこと", () => {
      const user = userEvent.setup();
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [2, 3], // 子ノード1と子ノード2を選択
        onUpdateSuccess: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);

      const updateButton = screen.getByLabelText("更新");
      expect(updateButton).toBeInTheDocument();
      expect(updateButton).not.toHaveClass("btn-disabled");
      user.click(updateButton);

      const updateModalButton = screen.getByLabelText("更新する");
      expect(updateModalButton).toBeInTheDocument();
      user.click(updateModalButton);

      // TODO:更新するボタンを押すと、layerToolコンポーネントのsaveLayerPropertyメソッドが呼ばれること
    });
  });
});

describe("入力値のバリデーション", () => {
  beforeEach(() => {
    const toolAreaProps: ToolAreaProps = {
      treeData: fixtures.treeData,
      selectedNodeIds: [2, 3], // 子ノード1と子ノード2を選択
      onUpdateSuccess: jest.fn(),
    };
    render(<ToolArea {...toolAreaProps} />);
  });

  describe("エラーがないとき", () => {
    it("更新ボタンがアクティブな状態で表示されていること", () => {
      //TODO: ボタンではなくモーダルを取得してしまっているため機能してない。ボタンを取得する方法を調べる
      const updateButton = screen.getByLabelText("更新");
      // expect(updateButton).toBeInTheDocument();
      // expect(updateButton).not.toHaveClass("btn-disabled");
    });
    it("エラーメッセージが表示されていないこと", () => {
      expect(screen.queryByText("必須項目です")).not.toBeInTheDocument();
      expect(
        screen.queryByText("数値を入力してください")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("％表示のときは単位を空にしてください")
      ).not.toBeInTheDocument();
    });
  });
  describe("単項目のバリデーション", () => {
    describe("名前フィールドが空のとき", () => {
      beforeEach(() => {
        const nameInputs = screen.getAllByRole("textbox", { name: "名前" });
        userEvent.clear(nameInputs[0]);
      });
      it.todo("更新ボタンが非アクティブな状態で表示されていること");
      it.todo("'必須項目です'というエラーメッセージが表示されていること");
      it.todo("他の項目を変更してもエラーは消えないこと");
      it.todo("スペースのみを入力してもエラーは消えないこと");
      it.todo(
        "文字列を入力するとエラーが消え、更新ボタンがアクティブになること"
      );
    });
    describe("数値フィールドが空のとき", () => {
      it.todo("更新ボタンが非アクティブな状態で表示されていること");
      it.todo("'必須項目です'というエラーメッセージが表示されていること");
      it.todo("他の項目を変更してもエラーは消えないこと");
      it.todo("スペースのみを入力してもエラーは消えないこと");
      it.todo("数値を入力するとエラーが消え、更新ボタンがアクティブになること");
    });
    describe("名前フィールドと数値フィールドの両方が空のとき", () => {
      it.todo("更新ボタンが非アクティブな状態で表示されていること");
      it.todo(
        "'必須項目です'というエラーメッセージが両項目に表示されていること"
      );
      it.todo("片方だけ入力しても、更新ボタンは非アクティブのままなこと");
      it.todo(
        "名前と数値を入力するとエラーが消え、更新ボタンがアクティブになること"
      );
    });
    describe("数値フィールドに数値以外が入力されているとき", () => {
      it.todo("更新ボタンが非アクティブな状態で表示されていること");
      it.todo(
        "'数値を入力してください'というエラーメッセージが表示されていること"
      );
      it.todo("文字列に続けて値を入力してもエラーが消えないこと");
      it.todo(
        "入力を削除すると'必須項目です'というエラーメッセージに変わること"
      );
    });
    describe("端数フィールドに負の数を入力するとき", () => {
      it.todo(
        "-を入力した時点では'数値を入力してください'というエラーメッセージが表示されること"
      );
      it.todo(
        "-に続けて数値を入力するとエラーが消え、更新ボタンがアクティブになること"
      );
      it.todo("-に続けて数値以外の文字列を入力してもエラーは消えないこと");
    });
    describe("端数フィールドが空白のとき", () => {
      it.todo("更新ボタンがアクティブな状態で表示されていること");
      it.todo("エラーが表示されないこと");
    });
    describe("端数フィールドに数値が入力されているとき", () => {
      it.todo("更新ボタンがアクティブな状態で表示されていること");
      it.todo("エラーが表示されないこと");
    });
    describe("端数フィールドに数値以外が入力されているとき", () => {
      it.todo("更新ボタンが非アクティブな状態で表示されていること");
      it.todo(
        "'数値を入力してください'というエラーメッセージが表示されていること"
      );
    });
    describe("端数フィールドに負の数を入力するとき", () => {
      it.todo(
        "-を入力した時点では'数値を入力してください'というエラーメッセージが表示されること"
      );
      it.todo(
        "-に続けて数値を入力するとエラーが消え、更新ボタンがアクティブになること"
      );
      it.todo("-に続けて数値以外の文字列を入力してもエラーは消えないこと");
    });
  });

  describe("表示形式が%のときは、単位を空白にする", () => {
    it.todo(
      "単位入力なし・表示形式%の状態から、単位を入力するとエラーを表示すること"
    );
    it.todo(
      "単位入力あり・表示形式万の状態から、表示形式を%に変更するとエラーを表示すること"
    );
    it.todo(
      "単位入力あり・表示形式%でエラーを表示している状態で、表示形式を「なし」に変更するとエラーが消えること"
    );
    it.todo(
      "単位入力あり・表示形式%でエラーを表示している状態で、単位を空に変更するとエラーが消えること"
    );
    it.todo(
      "単位入力あり・表示形式%でエラーを表示している状態で、単位を空にしてエラーを消す→再び単位を入力するとエラーが表示さ.todoれること"
    );
    it.todo(
      "単位入力あり・表示形式%でエラーを表示している状態で、表示形式を万にしてエラーを消す→再び表示形式を%にするとエラー.todoが表示されること"
    );
  });
});

describe("選択したノードがルートノードの時", () => {
  describe("初期表示時", () => {
    it.todo("要素感の関係が表示されていないこと");
    it.todo("ノード詳細が表示されていること");
    it.todo("要素を追加ボタンが表示されていないこと");
    it.todo("更新ボタンがアクティブな状態で表示されていること");
  });
  describe("更新を実行する時", () => {
    it.todo("更新ボタンを押すとonUpdateSuccessをコールすること");
  });
});
