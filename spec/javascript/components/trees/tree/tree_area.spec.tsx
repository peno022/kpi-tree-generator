import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  TreeArea,
  TreeAreaProps,
} from "../../../../../app/javascript/components/trees/tree/tree_area";
import * as fixtures from "../../../__fixtures__/sample_data";

// TypeError: Cannot read properties of undefined (reading 'baseVal') が出る
// ツリー表示はsystemテストで動作確認できているため、いったんskip
describe.skip("ツリーの表示", () => {
  describe("ノードが選択されていないとき", () => {
    it("すべてのノードが灰色の状態で、読み込んだデータのツリー図が表示されること", () => {
      const handleClick = jest.fn();
      const props: TreeAreaProps = {
        treeData: fixtures.treeData,
        selectedNodeIds: [],
        handleClick,
      };
      const { container } = render(<TreeArea {...props} />);
      const nodes = container.querySelectorAll(".rd3t-leaf-node, .rd3t-node");
      expect(nodes).toHaveLength(8);
      nodes.forEach((node) => {
        expect(node).toHaveStyle("fill: ghostwhite");
      });
    });
    it.todo("ノードをクリックすると、handleClick関数が呼び出されること");
  });
  describe("ノードが選択されているとき", () => {
    it.todo("選択されているノードは、色が変わっていること");
    it.todo("選択されていないノードは、色が変わっていないこと");
  });
});
