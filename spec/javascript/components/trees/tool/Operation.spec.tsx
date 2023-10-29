import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Operation, {
  OperationProps,
} from "@/components/trees/tool/operationArea/Operation";

describe("Operation", () => {
  const activeButtonClass = "bg-slate-50 border border-gray-400";
  const inActiveButtonClass =
    "bg-gray-200 text-gray-400 border border-gray-400";

  it("かけ算・選択状態のとき", () => {
    const operationProps: OperationProps = {
      isSelected: true,
      operation: "multiply",
      onClick: jest.fn(),
    };
    render(<Operation {...operationProps} />);
    const operationButton = screen.getByRole("button");
    expect(operationButton).toHaveClass(activeButtonClass);
    expect(operationButton).toHaveTextContent("かけ算");
  });

  it("かけ算・非選択状態のとき", () => {
    const operationProps: OperationProps = {
      isSelected: false,
      operation: "multiply",
      onClick: jest.fn(),
    };
    render(<Operation {...operationProps} />);
    const operationButton = screen.getByRole("button");
    expect(operationButton).toHaveClass(inActiveButtonClass);
    expect(operationButton).toHaveTextContent("かけ算");
  });

  it("たし算のとき", () => {
    const operationProps: OperationProps = {
      isSelected: true,
      operation: "add",
      onClick: jest.fn(),
    };
    render(<Operation {...operationProps} />);
    const operationButton = screen.getByRole("button");
    expect(operationButton).toHaveTextContent("たし算");
  });
});
