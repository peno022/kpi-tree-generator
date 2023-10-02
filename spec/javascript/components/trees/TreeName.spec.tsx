import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { TreeName } from "@/pages/trees/TreeName";
import { useTreeNameUpdate } from "@/hooks/useTreeNameUpdate";

jest.mock("@/hooks/useTreeNameUpdate", () => ({
  useTreeNameUpdate: jest.fn(),
}));

const mockSendTreeNameUpdateRequest = jest.fn();

beforeEach(() => {
  (useTreeNameUpdate as jest.Mock).mockReturnValue({
    errorMessage: null,
    setErrorMessage: jest.fn(),
    sendTreeNameUpdateRequest: mockSendTreeNameUpdateRequest,
    isUpdating: false,
  });
});

afterEach(() => {
  document.body.innerHTML = "";
});

const user = userEvent.setup();

describe("TreeName", () => {
  describe("初期表示時の異常系", () => {
    it("treeNameがない時は、エラーメッセージが表示されること。編集ボタンは表示されないこと。", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "tree-name";
      mockElement.setAttribute("data-tree-id", "12345");
      // treeName をセットしない
      document.body.appendChild(mockElement);

      render(<TreeName />);
      expect(document.querySelector(".text-error")).toHaveTextContent(
        "ツリー名の読み込みにエラーが発生しています。画面を再読み込みして再度お試しください。"
      );
    });

    it("treeIdがない時、エラーメッセージが表示されること。編集ボタンは表示されないこと。", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "tree-name";
      // treeId をセットしない
      mockElement.setAttribute("data-tree-name", "Valid Name");
      document.body.appendChild(mockElement);

      render(<TreeName />);
      expect(document.querySelector(".text-error")).toHaveTextContent(
        "ツリー名の読み込みにエラーが発生しています。画面を再読み込みして再度お試しください。"
      );
    });

    it("treeIdが数値でない時、エラーメッセージが表示されること。編集ボタンは表示されないこと。", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "tree-name";
      mockElement.setAttribute("data-tree-id", "invalid-id");
      mockElement.setAttribute("data-tree-name", "Valid Name");
      document.body.appendChild(mockElement);

      render(<TreeName />);
      expect(document.querySelector(".text-error")).toHaveTextContent(
        "ツリー名の読み込みにエラーが発生しています。画面を再読み込みして再度お試しください。"
      );
    });

    it("treeNameが空文字の時、エラーメッセージが表示されること。編集ボタンは表示されないこと。", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "tree-name";
      mockElement.setAttribute("data-tree-id", "12345");
      mockElement.setAttribute("data-tree-name", "");
      document.body.appendChild(mockElement);

      render(<TreeName />);
      expect(document.querySelector(".text-error")).toHaveTextContent(
        "ツリー名の読み込みにエラーが発生しています。画面を再読み込みして再度お試しください。"
      );
    });
  });

  describe("ツリー名更新実行時の異常系", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="tree-name" data-tree-id="1" data-tree-name="売上ツリー"></div>
      `;
    });

    it("ツリー名が変更されていない時、sendTreeNameUpdateRequestが呼ばれずに完了すること", async () => {
      render(<TreeName />);
      const editButton = screen.getByRole("button", {
        name: "Edit tree name",
      });
      await act(async () => {
        await user.click(editButton);
      });
      const okButton = screen.getByRole("button", { name: "OK" });
      await act(async () => {
        await user.click(okButton);
      });
      expect(mockSendTreeNameUpdateRequest).not.toHaveBeenCalled();
      expectVisibleTreeName("売上ツリー");
      expect(
        screen.queryByRole("textbox", {
          name: "tree-name-input",
        })
      ).not.toBeInTheDocument();
    });

    it.todo("ツリー名の更新に失敗した時、エラーメッセージが表示されること");

    // 下記はuseTreeNameUpdateの実体を利用してシステムテストで確認できている
    // it.todo(
    //   "ツリー名が空文字の時、「ツリー名を入力してください」というエラーが表示されること"
    // );
    // it.todo(
    //   "エラーメッセージが表示されている状態で、再度ツリー名の編集をしてOKボタンを押すと、エラーメッセージが消えること"
    // );
  });

  describe("正常系", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="tree-name" data-tree-id="1" data-tree-name="売上ツリー"></div>
      `;
    });

    it("treeNameと編集ボタンが表示されること", () => {
      render(<TreeName />);
      expectVisibleTreeName("売上ツリー");
      const editButton = screen.getByRole("button", { name: "Edit tree name" });
      expect(editButton).toBeInTheDocument();
    });

    it("編集ボタンを押すと、ツリー名が編集可能になること", async () => {
      render(<TreeName />);
      const editButton = screen.getByRole("button", { name: "Edit tree name" });
      await act(async () => {
        await user.click(editButton);
      });
      const treeNameInput = screen.getByRole("textbox", {
        name: "tree-name-input",
      });
      expect(treeNameInput).toBeInTheDocument();
      await act(async () => {
        await user.type(treeNameInput, "編集後");
      });
      expect(treeNameInput).toHaveValue("売上ツリー編集後");
    });

    it("編集ボタンを押すと、OKボタンとキャンセルボタンが表示され、編集ボタンは非表示になること", async () => {
      render(<TreeName />);
      const editButton = screen.getByRole("button", { name: "Edit tree name" });
      await act(async () => {
        await user.click(editButton);
      });
      const okButton = screen.getByRole("button", { name: "OK" });
      const cancelButton = screen.getByRole("button", { name: "キャンセル" });
      expect(okButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Edit tree name" })
      ).not.toBeInTheDocument();
    });

    it("キャンセルボタンを押すと、ツリー名の編集がキャンセルされること", async () => {
      render(<TreeName />);
      const editButton = screen.getByRole("button", { name: "Edit tree name" });
      await act(async () => {
        await user.click(editButton);
      });
      const treeNameInput = screen.getByRole("textbox", {
        name: "tree-name-input",
      });
      await act(async () => {
        await user.type(treeNameInput, "編集後");
      });
      const cancelButton = screen.getByRole("button", { name: "キャンセル" });
      await act(async () => {
        await user.click(cancelButton);
      });
      expect(treeNameInput).not.toBeInTheDocument();
      expect(cancelButton).not.toBeInTheDocument();
      expectVisibleTreeName("売上ツリー");
      expect(
        screen.getByRole("button", { name: "Edit tree name" })
      ).toBeInTheDocument();
    });

    it("ツリー名の編集をして、OKボタンを押すと、ツリー名が更新されること", async () => {
      mockSendTreeNameUpdateRequest.mockResolvedValueOnce("編集後のツリー名");
      render(<TreeName />);
      const editButton = screen.getByRole("button", { name: "Edit tree name" });
      await user.click(editButton);
      const treeNameInput = screen.getByRole("textbox", {
        name: "tree-name-input",
      });
      await user.type(treeNameInput, "編集後");
      const okButton = screen.getByRole("button", { name: "OK" });
      await user.click(okButton);
      expect(mockSendTreeNameUpdateRequest).toHaveBeenCalledWith(
        "売上ツリー編集後"
      );
      expect(treeNameInput).not.toBeInTheDocument();
      expectVisibleTreeName("編集後のツリー名");
    });

    it("ツリー名の編集をして、OKボタンを押すと、OKボタンとキャンセルボタンが表示されないこと", async () => {
      mockSendTreeNameUpdateRequest.mockResolvedValueOnce("編集後のツリー名");
      render(<TreeName />);
      const editButton = screen.getByRole("button", { name: "Edit tree name" });
      await user.click(editButton);
      const treeNameInput = screen.getByRole("textbox", {
        name: "tree-name-input",
      });
      await user.type(treeNameInput, "編集後");
      const okButton = screen.getByRole("button", { name: "OK" });
      await user.click(okButton);
      expect(
        screen.queryByRole("button", { name: "OK" })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "キャンセル" })
      ).not.toBeInTheDocument();
    });

    it("ツリー名の編集をして、OKボタンを押すと、編集ボタンが表示されること", async () => {
      mockSendTreeNameUpdateRequest.mockResolvedValueOnce("編集後のツリー名");
      render(<TreeName />);
      const editButton = screen.getByRole("button", { name: "Edit tree name" });
      await user.click(editButton);
      const treeNameInput = screen.getByRole("textbox", {
        name: "tree-name-input",
      });
      await user.type(treeNameInput, "編集後");
      const okButton = screen.getByRole("button", { name: "OK" });
      await user.click(okButton);
      expect(
        screen.getByRole("button", { name: "Edit tree name" })
      ).toBeInTheDocument();
    });

    it("ツリー名の編集をして、OKボタンを押すと、ツリー名の編集が不可になること", async () => {
      mockSendTreeNameUpdateRequest.mockResolvedValueOnce("編集後のツリー名");
      render(<TreeName />);
      const editButton = screen.getByRole("button", { name: "Edit tree name" });
      await user.click(editButton);
      const treeNameInput = screen.getByRole("textbox", {
        name: "tree-name-input",
      });
      await user.type(treeNameInput, "編集後");
      const okButton = screen.getByRole("button", { name: "OK" });
      await user.click(okButton);
      expect(treeNameInput).not.toBeInTheDocument();
    });
  });
});

function expectVisibleTreeName(name: string) {
  const allH1Elements = screen.getAllByRole("heading", { level: 1 });
  const visibleH1ElementsWithText = allH1Elements.filter(
    (element) =>
      !element.classList.contains("hidden") && element.textContent === name
  );
  expect(visibleH1ElementsWithText.length).toBe(1);
}
