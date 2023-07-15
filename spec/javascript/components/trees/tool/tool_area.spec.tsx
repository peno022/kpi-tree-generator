import React from "react";
import { render, screen, within, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import {
  ToolArea,
  ToolAreaProps,
} from "../../../../../app/javascript/components/trees/tool/tool_area";
import * as fixtures from "../../../__fixtures__/sample_data";

const user = userEvent.setup();

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
      expect(screen.getByRole("textbox", { name: "端数" })).toHaveValue("0");
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
      const nodeDetail1 = screen.getByRole("group", { name: "要素1" });
      expect(
        within(nodeDetail1).getByRole("textbox", { name: "名前" })
      ).toHaveValue("子ノード1");
      expect(
        within(nodeDetail1).getByRole("textbox", { name: "単位" })
      ).toHaveValue("円");
      expect(
        within(nodeDetail1).getByRole("textbox", { name: "数値" })
      ).toHaveValue("100");
      expect(
        within(nodeDetail1).getByRole("combobox", { name: "表示形式" })
      ).toHaveValue("万");
      expect(
        within(nodeDetail1).getByRole("checkbox", {
          name: "数値を自動更新しない",
        })
      ).not.toBeChecked();
      const nodeDetail2 = screen.getByRole("group", { name: "要素2" });
      expect(
        within(nodeDetail2).getByRole("textbox", { name: "名前" })
      ).toHaveValue("子ノード2");
      expect(
        within(nodeDetail2).getByRole("textbox", { name: "単位" })
      ).toHaveValue("円");
      expect(
        within(nodeDetail2).getByRole("textbox", { name: "数値" })
      ).toHaveValue("200");
      expect(
        within(nodeDetail2).getByRole("combobox", { name: "表示形式" })
      ).toHaveValue("万");
      expect(
        within(nodeDetail2).getByRole("checkbox", {
          name: "数値を自動更新しない",
        })
      ).not.toBeChecked();
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
      const updateButton = screen.getByRole("button", { name: "更新" });
      expect(updateButton).toBeInTheDocument();
      expect(updateButton).toHaveClass("btn-primary");
      expect(updateButton).not.toHaveClass("btn-disabled");
    });
  });
  describe("更新を実行する時", () => {
    it.skip("更新ボタンを押した後にモーダル上の「更新する」ボタンを押すと更新処理を呼ぶこと", async () => {
      const toolAreaProps: ToolAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [2, 3], // 子ノード1と子ノード2を選択
        onUpdateSuccess: jest.fn(),
      };
      render(<ToolArea {...toolAreaProps} />);

      const updateButton = screen.getByRole("button", { name: "更新" });
      expect(updateButton).toBeInTheDocument();
      expect(updateButton).toHaveClass("btn-primary");
      expect(updateButton).not.toHaveClass("btn-disabled");
      await user.click(updateButton);

      const updateModalButton = screen.getByRole("button", {
        name: "更新する",
      });
      expect(updateModalButton).toBeInTheDocument();
      await user.click(updateModalButton);

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
      const updateButton = screen.getByRole("button", { name: "更新" });
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
          const node1NameField = within(
            screen.getByRole("group", { name: "要素1" })
          ).getByRole("textbox", { name: "名前" });
          await act(async () => {
            await user.clear(node1NameField);
          });
        });
        it("更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = screen.getByRole("button", { name: "更新" });
          expect(updateButton).toBeInTheDocument();
          await waitFor(() => expect(updateButton).toHaveClass("btn-disabled"));
        });
        it("'必須項目です'というエラーメッセージが表示されていること", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
        it("他の項目を変更してもエラーは消えないこと", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
          const nodeDetail1 = screen.getByRole("group", { name: "要素1" });
          await act(async () => {
            await user.type(
              within(nodeDetail1).getByRole("textbox", { name: "単位" }),
              "ドル"
            );
          });
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
        it("スペースのみを入力してもエラーは消えないこと", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
          const nodeDetail1 = screen.getByRole("group", { name: "要素1" });
          await act(async () => {
            await user.type(
              within(nodeDetail1).getByRole("textbox", { name: "名前" }),
              " "
            );
          });
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
        it("文字列を入力するとエラーが消え、更新ボタンがアクティブになること", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
          const updateButton = screen.getByRole("button", { name: "更新" });
          await waitFor(() => expect(updateButton).toHaveClass("btn-disabled"));
          const nodeDetail1 = screen.getByRole("group", { name: "要素1" });
          await act(async () => {
            await user.type(
              within(nodeDetail1).getByRole("textbox", { name: "名前" }),
              "再入力した名前"
            );
          });
          await waitFor(() =>
            expect(screen.queryByText("必須項目です")).not.toBeInTheDocument()
          );
          await waitFor(() =>
            expect(updateButton).not.toHaveClass("btn-disabled")
          );
        });
      });
      describe("数値フィールドが空のとき", () => {
        beforeEach(async () => {
          const node1ValueField = within(
            screen.getByRole("group", { name: "要素1" })
          ).getByRole("textbox", { name: "数値" });
          await act(async () => {
            await user.clear(node1ValueField);
          });
        });
        it("更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = screen.getByRole("button", { name: "更新" });
          expect(updateButton).toBeInTheDocument();
          await waitFor(() => expect(updateButton).toHaveClass("btn-disabled"));
        });
        it("'必須項目です'というエラーメッセージが表示されていること", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
        it("他の項目を変更してもエラーは消えないこと", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
          const nodeDetail1 = screen.getByRole("group", { name: "要素1" });
          await act(async () => {
            await user.type(
              within(nodeDetail1).getByRole("textbox", { name: "単位" }),
              "ドル"
            );
          });
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
        it("スペースのみを入力してもエラーは消えないこと", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
          const nodeDetail1 = screen.getByRole("group", { name: "要素1" });
          await act(async () => {
            await user.type(
              within(nodeDetail1).getByRole("textbox", { name: "数値" }),
              " "
            );
          });
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
        it("数値を入力するとエラーが消え、更新ボタンがアクティブになること", async () => {
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
          const updateButton = screen.getByRole("button", { name: "更新" });
          await waitFor(() => expect(updateButton).toHaveClass("btn-disabled"));
          const nodeDetail1 = screen.getByRole("group", { name: "要素1" });
          await act(async () => {
            await user.type(
              within(nodeDetail1).getByRole("textbox", { name: "数値" }),
              "100"
            );
          });
          await waitFor(() =>
            expect(screen.queryByText("必須項目です")).not.toBeInTheDocument()
          );
          await waitFor(() =>
            expect(updateButton).not.toHaveClass("btn-disabled")
          );
        });
      });
      describe("名前フィールドと数値フィールドの両方が空のとき", () => {
        beforeEach(async () => {
          const node1NameField = within(
            screen.getByRole("group", { name: "要素1" })
          ).getByRole("textbox", { name: "数値" });
          const node1ValueField = within(
            screen.getByRole("group", { name: "要素1" })
          ).getByRole("textbox", { name: "数値" });
          await act(async () => {
            await user.clear(node1NameField);
            await user.clear(node1ValueField);
            expect(node1NameField).toHaveValue("");
            expect(node1ValueField).toHaveValue("");
          });
        });
        it("更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = screen.getByRole("button", { name: "更新" });
          expect(updateButton).toBeInTheDocument();
          await waitFor(() => expect(updateButton).toHaveClass("btn-disabled"));
        });
        it.skip("'必須項目です'というエラーメッセージが2つ表示されていること", async () => {
          const requiredErros = await screen.findAllByText("必須項目です");
          await waitFor(() => expect(requiredErros.length).toBe(2));
        });
        it("名前だけ入力するとエラーメッセージが1つ=表示され、更新ボタンは非アクティブのままなこと", async () => {
          const updateButton = screen.getByRole("button", { name: "更新" });
          await waitFor(() => expect(updateButton).toHaveClass("btn-disabled"));
          const nodeDetail1 = screen.getByRole("group", { name: "要素1" });
          await act(async () => {
            await user.type(
              within(nodeDetail1).getByRole("textbox", { name: "名前" }),
              "再入力した名前"
            );
          });
          const requiredErrosAfter = await screen.findAllByText("必須項目です");
          expect(requiredErrosAfter.length).toBe(1);
          await waitFor(() => expect(updateButton).toHaveClass("btn-disabled"));
        });
        it("名前と数値を入力するとエラーが消え、更新ボタンがアクティブになること", async () => {
          const nodeDetail1 = screen.getByRole("group", { name: "要素1" });
          await act(async () => {
            await user.type(
              within(nodeDetail1).getByRole("textbox", { name: "名前" }),
              "再入力した名前"
            );
            await user.type(
              within(nodeDetail1).getByRole("textbox", { name: "数値" }),
              "100"
            );
          });
          await waitFor(() =>
            expect(screen.queryByText("必須項目です")).not.toBeInTheDocument()
          );
          const updateButton = screen.getByRole("button", { name: "更新" });
          await waitFor(() =>
            expect(updateButton).not.toHaveClass("btn-disabled")
          );
        });
      });
      describe("端数フィールドが空のとき", () => {
        beforeEach(async () => {
          const fractionField = screen.getByRole("textbox", { name: "端数" });
          await act(async () => {
            await user.clear(fractionField);
            expect(fractionField).toHaveValue("");
          });
        });
        it("更新ボタンがアクティブな状態で表示されていること", () => {
          const updateButton = screen.getByRole("button", { name: "更新" });
          expect(updateButton).toBeInTheDocument();
          expect(updateButton).toHaveClass("btn-primary");
          expect(updateButton).not.toHaveClass("btn-disabled");
        });
        it("エラーが表示されないこと", async () => {
          await waitFor(() =>
            expect(screen.queryByText("必須項目です")).not.toBeInTheDocument()
          );
        });
      });
      describe("単位フィールドが空のとき", () => {
        beforeEach(async () => {
          const node1UnitField = within(
            screen.getByRole("group", { name: "要素1" })
          ).getByRole("textbox", { name: "単位" });
          await act(async () => {
            await user.clear(node1UnitField);
          });
        });
        it("更新ボタンがアクティブな状態で表示されていること", () => {
          const updateButton = screen.getByRole("button", { name: "更新" });
          expect(updateButton).toBeInTheDocument();
          expect(updateButton).toHaveClass("btn-primary");
          expect(updateButton).not.toHaveClass("btn-disabled");
        });
        it("エラーが表示されないこと", async () => {
          await waitFor(() =>
            expect(screen.queryByText("必須項目です")).not.toBeInTheDocument()
          );
        });
      });
    });
    describe("数値形式のチェック", () => {
      describe("端数フィールドに数値以外が入力されているとき", () => {
        beforeEach(async () => {
          const fractionField = screen.getByRole("textbox", { name: "端数" });
          await act(async () => {
            await user.clear(fractionField);
            await user.type(fractionField, "文字列");
          });
        });
        it("更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = screen.getByRole("button", { name: "更新" });
          expect(updateButton).toBeInTheDocument();
          await waitFor(() => expect(updateButton).toHaveClass("btn-disabled"));
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
          const fractionField = screen.getByRole("textbox", { name: "端数" });
          await act(async () => {
            await user.type(fractionField, "10");
            expect(fractionField).toHaveValue("文字列10");
          });
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
        });
      });
      describe("数値フィールドに数値以外が入力されているとき", () => {
        beforeEach(async () => {
          const node1ValueField = within(
            screen.getByRole("group", { name: "要素1" })
          ).getByRole("textbox", { name: "数値" });
          await act(async () => {
            await user.clear(node1ValueField);
            await user.type(node1ValueField, "文字列");
          });
        });
        it("更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = screen.getByRole("button", { name: "更新" });
          expect(updateButton).toBeInTheDocument();
          await waitFor(() => expect(updateButton).toHaveClass("btn-disabled"));
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
          const node1ValueField = within(
            screen.getByRole("group", { name: "要素1" })
          ).getByRole("textbox", { name: "数値" });
          await act(async () => {
            await user.type(node1ValueField, "10");
            expect(node1ValueField).toHaveValue("文字列10");
          });
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
        });
        it("入力を削除すると'必須項目です'というエラーメッセージに変わること", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
          const node1ValueField = within(
            screen.getByRole("group", { name: "要素1" })
          ).getByRole("textbox", { name: "数値" });
          await act(async () => {
            await user.clear(node1ValueField);
            expect(node1ValueField).toHaveValue("");
          });
          await waitFor(() =>
            expect(
              screen.queryByText("数値を入力してください")
            ).not.toBeInTheDocument()
          );
          expect(await screen.findByText("必須項目です")).toBeInTheDocument();
        });
      });
      describe("数値フィールドに負の数を入力するとき", () => {
        beforeEach(async () => {
          const node1ValueField = within(
            screen.getByRole("group", { name: "要素1" })
          ).getByRole("textbox", { name: "数値" });
          await act(async () => {
            await user.clear(node1ValueField);
            await user.type(node1ValueField, "-");
          });
        });
        it("-を入力した時点では更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = screen.getByRole("button", { name: "更新" });
          expect(updateButton).toBeInTheDocument();
          await waitFor(() => expect(updateButton).toHaveClass("btn-disabled"));
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
          const node1ValueField = within(
            screen.getByRole("group", { name: "要素1" })
          ).getByRole("textbox", { name: "数値" });
          await act(async () => {
            await user.type(node1ValueField, "100");
            expect(node1ValueField).toHaveValue("-100");
          });
          await waitFor(() =>
            expect(
              screen.queryByText("数値を入力してください")
            ).not.toBeInTheDocument()
          );
          const updateButton = screen.getByRole("button", { name: "更新" });
          await waitFor(() =>
            expect(updateButton).not.toHaveClass("btn-disabled")
          );
        });
        it("-に続けて数値以外の文字列を入力してもエラーは消えないこと", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
          const node1ValueField = within(
            screen.getByRole("group", { name: "要素1" })
          ).getByRole("textbox", { name: "数値" });
          await act(async () => {
            await user.type(node1ValueField, "ABC");
            expect(node1ValueField).toHaveValue("-ABC");
          });
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
        });
      });
      describe("端数フィールドに負の数を入力するとき", () => {
        beforeEach(async () => {
          const fractionField = screen.getByRole("textbox", { name: "端数" });
          await act(async () => {
            await user.clear(fractionField);
            await user.type(fractionField, "-");
          });
        });
        it("-を入力した時点では更新ボタンが非アクティブな状態で表示されていること", async () => {
          const updateButton = screen.getByRole("button", { name: "更新" });
          expect(updateButton).toBeInTheDocument();
          await waitFor(() => expect(updateButton).toHaveClass("btn-disabled"));
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
          const fractionField = screen.getByRole("textbox", { name: "端数" });
          await act(async () => {
            await user.type(fractionField, "100");
            expect(fractionField).toHaveValue("-100");
          });
          await waitFor(() =>
            expect(
              screen.queryByText("数値を入力してください")
            ).not.toBeInTheDocument()
          );
          const updateButton = screen.getByRole("button", { name: "更新" });
          await waitFor(() =>
            expect(updateButton).not.toHaveClass("btn-disabled")
          );
        });
        it("-に続けて数値以外の文字列を入力してもエラーは消えないこと", async () => {
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
          const fractionField = screen.getByRole("textbox", { name: "端数" });
          await act(async () => {
            await user.type(fractionField, "ABC");
            expect(fractionField).toHaveValue("-ABC");
          });
          expect(
            await screen.findByText("数値を入力してください")
          ).toBeInTheDocument();
        });
      });
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
