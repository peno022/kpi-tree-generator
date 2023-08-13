import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Operation, {
  OperationProps,
} from "@/components/trees/tool/operationArea/Operation";

describe("Operation", () => {
  it("かけ算・選択状態のとき", () => {
    const operationProps: OperationProps = {
      isSelected: true,
      operation: "multiply",
      onClick: () => {
        console.log("かけ算・選択状態");
      },
    };
    render(<Operation {...operationProps} />);
    const operationButton = screen.getByRole("button");
    expect(operationButton).toHaveClass("bg-base-100");
    expect(operationButton).toHaveClass("border");
    expect(operationButton).toHaveClass("border-neutral");
    expect(operationButton).toHaveTextContent("かけ算");
  });

  it("かけ算・非選択状態のとき", () => {
    const operationProps: OperationProps = {
      isSelected: false,
      operation: "multiply",
      onClick: () => {
        console.log("かけ算・非選択状態");
      },
    };
    render(<Operation {...operationProps} />);
    const operationButton = screen.getByRole("button");
    expect(operationButton).toHaveClass("bg-base-200");
    expect(operationButton).toHaveClass("text-base-300");
    expect(operationButton).toHaveClass("border");
    expect(operationButton).toHaveTextContent("かけ算");
  });

  it("たし算のとき", () => {
    const operationProps: OperationProps = {
      isSelected: true,
      operation: "add",
      onClick: () => {
        console.log("たし算・選択状態");
      },
    };
    render(<Operation {...operationProps} />);
    const operationButton = screen.getByRole("button");
    expect(operationButton).toHaveTextContent("たし算");
  });
});
