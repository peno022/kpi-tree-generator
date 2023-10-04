import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { ToolArea, ToolAreaProps } from "@/components/trees/tool/ToolArea";
import * as fixtures from "@spec/__fixtures__/sampleData";

const user = userEvent.setup();

function getNodeField(
  index: number,
  fieldName: "名前" | "数値" | "単位" | "表示形式" | "数値を自動更新しない"
) {
  switch (fieldName) {
    case "名前": {
      return within(
        screen.getByRole("group", { name: `要素${index}` })
      ).getByRole("textbox", { name: "名前" });
    }
    case "数値": {
      return within(
        screen.getByRole("group", { name: `要素${index}` })
      ).getByRole("textbox", { name: "数値" });
    }
    case "単位": {
      return within(
        screen.getByRole("group", { name: `要素${index}` })
      ).getByRole("textbox", { name: "単位" });
    }
    case "表示形式": {
      return within(
        screen.getByRole("group", { name: `要素${index}` })
      ).getByRole("combobox", { name: "表示形式" });
    }
    case "数値を自動更新しない": {
      return within(
        screen.getByRole("group", { name: `要素${index}` })
      ).getByRole("checkbox", { name: "数値を自動更新しない" });
    }
  }
}

function getUpdateButton() {
  return screen.getByRole("button", { name: "更新" });
}

function getFractionField() {
  return screen.getByRole("textbox", { name: "端数" });
}

describe("ノードが選択されていないとき", () => {
  it("'要素を選択すると、ここに詳細が表示されます。'というテキストが表示されること", () => {
    const toolAreaProps: ToolAreaProps = {
      treeData: fixtures.treeData,
      selectedNodeIds: [],
      onUpdateSuccess: jest.fn(),
      onUpdateStatusChange: jest.fn(),
    };
    render(<ToolArea {...toolAreaProps} />);
    expect(
      screen.getByText("要素を選択すると、ここに詳細が表示されます。")
    ).toBeInTheDocument();
  });
});

describe("正常なデータでは起きないはずのエラー", () => {
  describe("選択したノードIDに該当するノードがツリーに存在しないとき", () => {
    it("'選択された要素のIDが不正です。'というテキストが表示されること", () => {
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [999999, 9999999],
        onUpdateSuccess: jest.fn(),
        onUpdateStatusChange: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);
      expect(
        screen.getByText(
          "選択された要素のIDが不正です。画面を再読み込みしてもう一度お試しください。"
        )
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
        onUpdateStatusChange: jest.fn(),
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
        onUpdateStatusChange: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);

      expect(screen.getByText("要素間の関係")).toBeInTheDocument();
      const multiplyButton = screen.getByRole("button", { name: "かけ算" });
      expect(multiplyButton).toBeInTheDocument();
      const activeButtonClass =
        "bg-base-200 text-base-300 border border-base-200";
      expect(multiplyButton).toHaveClass(activeButtonClass);
      const addButton = screen.getByRole("button", { name: "たし算" });
      expect(addButton).toBeInTheDocument();
      const inActiveButtonClass = "bg-base-100 border border-neutral";
      expect(addButton).toHaveClass(inActiveButtonClass);
    });

    it("親子ノード間の計算式が表示されていること", () => {
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [2, 3], // 子ノード1と子ノード2を選択
        onUpdateSuccess: jest.fn(),
        onUpdateStatusChange: jest.fn(),
      };
      const { container } = render(<ToolArea {...toolAreaProps} />);
      const calculationDiv = container.querySelector(".calculation");
      if (!calculationDiv) {
        throw new Error("calculationDiv is null");
      }
      expect(screen.getByText("親ノード")).toBeInTheDocument();
      expect(screen.getByText("300万円")).toBeInTheDocument();
      expect(screen.getByText("子ノード1")).toBeInTheDocument();
      expect(screen.getByText("100万円")).toBeInTheDocument();
      expect(screen.getByText("子ノード2")).toBeInTheDocument();
      expect(screen.getByText("200万円")).toBeInTheDocument();
      expect(screen.getByText("端数")).toBeInTheDocument();
      expect(getFractionField()).toHaveValue("0");
      expect(calculationDiv.getElementsByClassName("fa-equals").length).toBe(1);
      expect(calculationDiv.getElementsByClassName("fa-plus").length).toBe(2);
    });

    it("ノード詳細が表示されていること", () => {
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [2, 3], // 子ノード1と子ノード2を選択
        onUpdateSuccess: jest.fn(),
        onUpdateStatusChange: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);
      expect(getNodeField(1, "名前")).toHaveValue("子ノード1");
      expect(getNodeField(1, "単位")).toHaveValue("円");
      expect(getNodeField(1, "数値")).toHaveValue("100");
      expect(getNodeField(1, "表示形式")).toHaveValue("万");
      expect(getNodeField(1, "数値を自動更新しない")).not.toBeChecked();
      expect(getNodeField(2, "名前")).toHaveValue("子ノード2");
      expect(getNodeField(2, "単位")).toHaveValue("円");
      expect(getNodeField(2, "数値")).toHaveValue("200");
      expect(getNodeField(2, "表示形式")).toHaveValue("万");
      expect(getNodeField(2, "数値を自動更新しない")).not.toBeChecked();
    });

    it("要素を追加ボタンが表示されていること", () => {
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [2, 3], // 子ノード1と子ノード2を選択
        onUpdateSuccess: jest.fn(),
        onUpdateStatusChange: jest.fn(),
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
        onUpdateStatusChange: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);
      const updateButton = getUpdateButton();
      expect(updateButton).toBeInTheDocument();
      expect(updateButton).toHaveClass("btn-primary");
      expect(updateButton).not.toHaveClass("btn-disabled");
    });
  });
});

describe("入力値のバリデーション", () => {
  beforeEach(() => {
    const toolAreaProps: ToolAreaProps = {
      treeData: fixtures.treeData,
      selectedNodeIds: [2, 3], // 子ノード1と子ノード2を選択
      onUpdateSuccess: jest.fn(),
      onUpdateStatusChange: jest.fn(),
    };
    render(<ToolArea {...toolAreaProps} />);
  });

  describe("エラーがないとき", () => {
    it("更新ボタンがアクティブな状態で表示されていること", () => {
      const updateButton = getUpdateButton();
      expect(updateButton).toBeInTheDocument();
      expect(updateButton).toHaveClass("btn-primary");
      expect(updateButton).not.toHaveClass("btn-disabled");
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
    describe("必須項目のチェック", () => {
      describe("名前フィールドが空のとき", () => {
        beforeEach(async () => {
          const node1NameField = getNodeField(1, "名前");
          await user.clear(node1NameField);
        });
        it("更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = getUpdateButton();
          expect(updateButton).toBeInTheDocument();
          expect(updateButton).toHaveClass("btn-disabled");
        });
        it("'必須項目です'というエラーメッセージが表示されていること", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
        it("他の項目を変更してもエラーは消えないこと", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
          await user.type(getNodeField(1, "単位"), "ドル");
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
        it("スペースのみを入力してもエラーは消えないこと", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
          await user.type(getNodeField(1, "名前"), " ");
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
        it("文字列を入力するとエラーが消え、更新ボタンがアクティブになること", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
          const updateButton = getUpdateButton();
          expect(updateButton).toHaveClass("btn-disabled");
          await user.type(getNodeField(1, "名前"), "再入力した名前");
          expect(screen.queryByText("必須項目です")).not.toBeInTheDocument();
          expect(updateButton).not.toHaveClass("btn-disabled");
        });
      });
      describe("数値フィールドが空のとき", () => {
        beforeEach(async () => {
          await user.clear(getNodeField(1, "数値"));
        });
        it("更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = getUpdateButton();
          expect(updateButton).toBeInTheDocument();
          expect(updateButton).toHaveClass("btn-disabled");
        });
        it("'必須項目です'というエラーメッセージが表示されていること", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
        it("他の項目を変更してもエラーは消えないこと", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
          await user.type(getNodeField(1, "単位"), "ドル");
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
        it("スペースのみを入力してもエラーは消えないこと", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
          await user.type(getNodeField(1, "数値"), " ");
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
        it("数値を入力するとエラーが消え、更新ボタンがアクティブになること", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
          const updateButton = getUpdateButton();
          expect(updateButton).toHaveClass("btn-disabled");
          await user.type(getNodeField(1, "数値"), "100");
          expect(screen.queryByText("必須項目です")).not.toBeInTheDocument();
          expect(updateButton).not.toHaveClass("btn-disabled");
        });
      });
      describe("名前フィールドと数値フィールドの両方が空のとき", () => {
        beforeEach(async () => {
          const node1NameField = getNodeField(1, "名前");
          const node1ValueField = getNodeField(1, "数値");
          await user.clear(node1NameField);
          await user.clear(node1ValueField);
          expect(node1NameField).toHaveValue("");
          expect(node1ValueField).toHaveValue("");
        });
        it("更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = getUpdateButton();
          expect(updateButton).toBeInTheDocument();
          expect(updateButton).toHaveClass("btn-disabled");
        });
        it("'必須項目です'というエラーメッセージが2つ表示されていること", async () => {
          const requiredErros = await screen.findAllByText("必須項目です");
          expect(requiredErros.length).toBe(2);
        });
        it("名前だけ入力するとエラーメッセージが1つ=表示され、更新ボタンは非アクティブのままなこと", async () => {
          const updateButton = getUpdateButton();
          expect(updateButton).toHaveClass("btn-disabled");
          await user.type(getNodeField(1, "名前"), "再入力した名前");
          const requiredErrosAfter = await screen.findAllByText("必須項目です");
          expect(requiredErrosAfter.length).toBe(1);
          expect(updateButton).toHaveClass("btn-disabled");
        });
        it("名前と数値を入力するとエラーが消え、更新ボタンがアクティブになること", async () => {
          await user.type(getNodeField(1, "名前"), "再入力した名前");
          await user.type(getNodeField(1, "数値"), "100");
          expect(screen.queryByText("必須項目です")).not.toBeInTheDocument();
          const updateButton = getUpdateButton();
          expect(updateButton).not.toHaveClass("btn-disabled");
        });
      });
      describe("端数フィールドが空のとき", () => {
        beforeEach(async () => {
          const fractionField = getFractionField();
          await user.clear(fractionField);
          expect(fractionField).toHaveValue("");
        });
        it("更新ボタンがアクティブな状態で表示されていること", () => {
          const updateButton = getUpdateButton();
          expect(updateButton).toBeInTheDocument();
          expect(updateButton).toHaveClass("btn-primary");
          expect(updateButton).not.toHaveClass("btn-disabled");
        });
        it("エラーが表示されないこと", async () => {
          expect(screen.queryByText("必須項目です")).not.toBeInTheDocument();
        });
      });
      describe("単位フィールドが空のとき", () => {
        beforeEach(async () => {
          await user.clear(getNodeField(1, "単位"));
        });
        it("更新ボタンがアクティブな状態で表示されていること", () => {
          const updateButton = getUpdateButton();
          expect(updateButton).toBeInTheDocument();
          expect(updateButton).toHaveClass("btn-primary");
          expect(updateButton).not.toHaveClass("btn-disabled");
        });
        it("エラーが表示されないこと", async () => {
          expect(screen.queryByText("必須項目です")).not.toBeInTheDocument();
        });
      });
    });
    describe("数値形式のチェック", () => {
      describe("端数フィールドに数値以外が入力されているとき", () => {
        beforeEach(async () => {
          const fractionField = getFractionField();
          await user.clear(fractionField);
          await user.type(fractionField, "文字列");
        });
        it("更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = getUpdateButton();
          expect(updateButton).toBeInTheDocument();
          expect(updateButton).toHaveClass("btn-disabled");
        });
        it("'数値を入力してください'というエラーメッセージが表示されていること", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
        });
        it("文字列に続けて値を入力してもエラーが消えないこと", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
          const fractionField = getFractionField();
          await user.type(fractionField, "10");
          expect(fractionField).toHaveValue("文字列10");
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
        });
      });
      describe("数値フィールドに数値以外が入力されているとき", () => {
        beforeEach(async () => {
          const node1ValueField = getNodeField(1, "数値");
          await user.clear(node1ValueField);
          await user.type(node1ValueField, "文字列");
        });
        it("更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = getUpdateButton();
          expect(updateButton).toBeInTheDocument();
          expect(updateButton).toHaveClass("btn-disabled");
        });
        it("'数値を入力してください'というエラーメッセージが表示されていること", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
        });
        it("文字列に続けて値を入力してもエラーが消えないこと", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
          const node1ValueField = getNodeField(1, "数値");
          await user.type(node1ValueField, "10");
          expect(node1ValueField).toHaveValue("文字列10");
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
        });
        it("入力を削除すると'必須項目です'というエラーメッセージに変わること", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
          const node1ValueField = getNodeField(1, "数値");
          await user.clear(node1ValueField);
          expect(node1ValueField).toHaveValue("");
          expect(
            screen.queryByText("数値を入力してください")
          ).not.toBeInTheDocument();
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
      });
      describe("数値フィールドに負の数を入力するとき", () => {
        beforeEach(async () => {
          const node1ValueField = getNodeField(1, "数値");
          await user.clear(node1ValueField);
          await user.type(node1ValueField, "-");
        });
        it("-を入力した時点では更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = getUpdateButton();
          expect(updateButton).toBeInTheDocument();
          expect(updateButton).toHaveClass("btn-disabled");
        });
        it("-を入力した時点では'数値を入力してください'というエラーメッセージが表示されていること", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
        });
        it("-に続けて数値を入力するとエラーが消え、更新ボタンがアクティブになること", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
          const node1ValueField = getNodeField(1, "数値");
          await user.type(node1ValueField, "100");
          expect(node1ValueField).toHaveValue("-100");
          expect(
            screen.queryByText("数値を入力してください")
          ).not.toBeInTheDocument();
          const updateButton = getUpdateButton();
          expect(updateButton).not.toHaveClass("btn-disabled");
        });
        it("-に続けて数値以外の文字列を入力してもエラーは消えないこと", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
          const node1ValueField = getNodeField(1, "数値");
          await user.type(node1ValueField, "ABC");
          expect(node1ValueField).toHaveValue("-ABC");
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
        });
      });
      describe("端数フィールドに負の数を入力するとき", () => {
        beforeEach(async () => {
          const fractionField = getFractionField();
          await user.clear(fractionField);
          await user.type(fractionField, "-");
        });
        it("-を入力した時点では更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = getUpdateButton();
          expect(updateButton).toBeInTheDocument();
          expect(updateButton).toHaveClass("btn-disabled");
        });
        it("-を入力した時点では'数値を入力してください'というエラーメッセージが表示されていること", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
        });
        it("-に続けて数値を入力するとエラーが消え、更新ボタンがアクティブになること", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
          const fractionField = getFractionField();
          await user.type(fractionField, "100");
          expect(fractionField).toHaveValue("-100");
          expect(
            screen.queryByText("数値を入力してください")
          ).not.toBeInTheDocument();
          const updateButton = getUpdateButton();
          expect(updateButton).not.toHaveClass("btn-disabled");
        });
        it("-に続けて数値以外の文字列を入力してもエラーは消えないこと", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
          const fractionField = getFractionField();
          await user.type(fractionField, "ABC");
          expect(fractionField).toHaveValue("-ABC");
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
        });
      });
    });
  });

  describe("表示形式が%のときは、単位を空白にする", () => {
    describe("エラーがない状態→エラーがある状態の変化", () => {
      it("単位入力なし・表示形式%の状態から、単位を入力するとエラーを表示すること", async () => {
        const node1UnitField = getNodeField(1, "単位");
        const node1ValueFormatField = getNodeField(1, "表示形式");
        await user.clear(node1UnitField);
        await user.selectOptions(node1ValueFormatField, "%");
        expect(node1UnitField).toHaveValue("");
        expect(node1ValueFormatField).toHaveValue("%");
        expect(
          screen.queryByText("％表示のときは単位を空にしてください")
        ).not.toBeInTheDocument();
        await user.type(node1UnitField, "円");
        expect(node1UnitField).toHaveValue("円");
        expect(
          (await screen.findAllByText("％表示のときは単位を空にしてください"))
            .length
        ).toBe(2);
      });
      it("単位入力あり・表示形式万の状態から、表示形式を%に変更するとエラーを表示すること", async () => {
        const node1UnitField = getNodeField(1, "単位");
        const node1ValueFormatField = getNodeField(1, "表示形式");
        expect(node1UnitField).toHaveValue("円");
        expect(node1ValueFormatField).toHaveValue("万");
        expect(
          screen.queryByText("％表示のときは単位を空にしてください")
        ).not.toBeInTheDocument();
        await user.selectOptions(node1ValueFormatField, "%");
        expect(node1ValueFormatField).toHaveValue("%");
        expect(
          (await screen.findAllByText("％表示のときは単位を空にしてください"))
            .length
        ).toBe(2);
      });
    });
    describe("エラーがある状態→ない状態の変化", () => {
      beforeEach(async () => {
        const node1UnitField = getNodeField(1, "単位");
        const node1ValueFormatField = getNodeField(1, "表示形式");
        await user.selectOptions(node1ValueFormatField, "%");
        expect(node1UnitField).toHaveValue("円");
        expect(node1ValueFormatField).toHaveValue("%");
        expect(
          (await screen.findAllByText("％表示のときは単位を空にしてください"))
            .length
        ).toBe(2);
      });
      it("単位入力あり・表示形式%でエラーを表示している状態で、表示形式を「なし」に変更するとエラーが消えること", async () => {
        const node1ValueFormatField = getNodeField(1, "表示形式");
        await user.selectOptions(node1ValueFormatField, "なし");
        expect(node1ValueFormatField).toHaveValue("なし");
        expect(
          screen.queryByText("％表示のときは単位を空にしてください")
        ).not.toBeInTheDocument();
      });
      it("単位入力あり・表示形式%でエラーを表示している状態で、単位を空に変更するとエラーが消えること", async () => {
        const node1UnitField = getNodeField(1, "単位");
        await user.clear(node1UnitField);
        expect(node1UnitField).toHaveValue("");
        expect(
          screen.queryByText("％表示のときは単位を空にしてください")
        ).not.toBeInTheDocument();
      });
      it("単位入力あり・表示形式%でエラーを表示している状態で、単位を空にしてエラーを消す→再び単位を入力するとエラーが表示されること", async () => {
        const node1UnitField = getNodeField(1, "単位");
        await user.clear(node1UnitField);
        expect(node1UnitField).toHaveValue("");
        expect(
          screen.queryByText("％表示のときは単位を空にしてください")
        ).not.toBeInTheDocument();
        await user.type(node1UnitField, "円");
        expect(node1UnitField).toHaveValue("円");
        expect(
          (await screen.findAllByText("％表示のときは単位を空にしてください"))
            .length
        ).toBe(2);
      });
      it("単位入力あり・表示形式%でエラーを表示している状態で、表示形式を万にしてエラーを消す→再び表示形式を%にするとエラーが表示されること", async () => {
        const node1ValueFormatField = getNodeField(1, "表示形式");
        await user.selectOptions(node1ValueFormatField, "万");
        expect(node1ValueFormatField).toHaveValue("万");
        expect(
          screen.queryByText("％表示のときは単位を空にしてください")
        ).not.toBeInTheDocument();
        await user.selectOptions(node1ValueFormatField, "%");
        expect(node1ValueFormatField).toHaveValue("%");
        expect(
          (await screen.findAllByText("％表示のときは単位を空にしてください"))
            .length
        ).toBe(2);
      });
    });
  });
});

describe("選択したノードがルートノードの時", () => {
  describe("初期表示時", () => {
    beforeEach(() => {
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [1],
        onUpdateSuccess: jest.fn(),
        onUpdateStatusChange: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);
    });

    it("要素間の関係が表示されていないこと", () => {
      expect(screen.queryByText("要素間の関係")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "かけ算" })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "たし算" })
      ).not.toBeInTheDocument();
    });
    it("ノード詳細が表示されていること", () => {
      expect(getNodeField(1, "名前")).toHaveValue("親ノード");
      expect(getNodeField(1, "単位")).toHaveValue("円");
      expect(getNodeField(1, "数値")).toHaveValue("300");
      expect(getNodeField(1, "表示形式")).toHaveValue("万");
      expect(getNodeField(1, "数値を自動更新しない")).toBeChecked();
    });
    it("要素を追加ボタンが表示されていないこと", () => {
      expect(
        screen.queryByRole("button", { name: "要素を追加" })
      ).not.toBeInTheDocument();
    });
    it("更新ボタンがアクティブな状態で表示されていること", () => {
      const updateButton = getUpdateButton();
      expect(updateButton).toBeInTheDocument();
      expect(updateButton).toHaveClass("btn-primary");
      expect(updateButton).not.toHaveClass("btn-disabled");
    });
  });
});
