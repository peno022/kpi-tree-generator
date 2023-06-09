/**
 * @jest-environment node
 */

import propagateSelectedNodesChangesToTree from "../../app/javascript/propagete_selected_nodes_changes_to_tree";
import { Node, Layer, TreeData } from "../../app/javascript/types";
import * as fixtures from "./__fixtures__/sample_data";

describe("propagateSelectedNodesChangesToTree", () => {
  it("ひ孫ノードを選択、ロックノードなし", () => {
    const {
      parentNode,
      childNode1,
      childNode2,
      childLayer,
      grandChildNode1,
      grandChildNode2,
      grandChildLayer,
      greatGrandChildNode1,
      greatGrandChildNode2,
      greatGrandChildNode3,
      greatGrandChildLayer,
    } = JSON.parse(JSON.stringify(fixtures));
    parentNode.isValueLocked = false;

    const treeData: TreeData = {
      tree: { id: 1, name: "Tree1" },
      nodes: [
        parentNode,
        childNode1,
        childNode2,
        grandChildNode1,
        grandChildNode2,
        greatGrandChildNode1,
        greatGrandChildNode2,
        greatGrandChildNode3,
      ],
      layers: [childLayer, grandChildLayer, greatGrandChildLayer],
    };

    const selectedNodes: Node[] = [
      greatGrandChildNode1,
      greatGrandChildNode2,
      greatGrandChildNode3,
    ];
    const selectedLayer: Layer = greatGrandChildLayer;

    selectedNodes[0].value = 1900;
    selectedNodes[1].value = 300000;
    selectedNodes[1].valueFormat = "なし";
    selectedNodes[2].value = 700;
    selectedNodes[2].valueFormat = "千";

    const result = propagateSelectedNodesChangesToTree(
      selectedNodes,
      selectedLayer,
      treeData
    );

    const expected: TreeData = {
      tree: { id: 1, name: "Tree1" },
      nodes: [
        {
          ...parentNode,
          value: 400,
        },
        {
          ...childNode1,
          value: 200,
        },
        {
          ...childNode2,
          value: 200,
        },
        {
          ...grandChildNode1,
          value: 2000,
        },
        {
          ...grandChildNode2,
          value: 10,
        },
        {
          ...greatGrandChildNode1,
          value: 1900,
        },
        {
          ...greatGrandChildNode2,
          value: 300000,
          valueFormat: "なし",
        },
        {
          ...greatGrandChildNode3,
          value: 700,
          valueFormat: "千",
        },
      ],
      layers: [
        { ...childLayer },
        {
          ...grandChildLayer,
        },
        {
          ...greatGrandChildLayer,
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it("ひ孫ノードを選択、その親ノードのisValueLockedがtrue", () => {
    const {
      parentNode,
      childNode1,
      childNode2,
      childLayer,
      grandChildNode1,
      grandChildNode2,
      grandChildLayer,
      greatGrandChildNode1,
      greatGrandChildNode2,
      greatGrandChildNode3,
      greatGrandChildLayer,
    } = JSON.parse(JSON.stringify(fixtures));
    parentNode.isValueLocked = false;
    grandChildNode1.isValueLocked = true;

    const treeData: TreeData = {
      tree: { id: 1, name: "Tree1" },
      nodes: [
        parentNode,
        childNode1,
        childNode2,
        grandChildNode1,
        grandChildNode2,
        greatGrandChildNode1,
        greatGrandChildNode2,
        greatGrandChildNode3,
      ],
      layers: [childLayer, grandChildLayer, greatGrandChildLayer],
    };

    const selectedNodes: Node[] = [
      greatGrandChildNode1,
      greatGrandChildNode2,
      greatGrandChildNode3,
    ];
    const selectedLayer: Layer = greatGrandChildLayer;

    selectedNodes[0].value = 1900;
    selectedNodes[1].value = 300000;
    selectedNodes[1].valueFormat = "なし";
    selectedNodes[2].value = 700;
    selectedNodes[2].valueFormat = "千";

    const result = propagateSelectedNodesChangesToTree(
      selectedNodes,
      selectedLayer,
      treeData
    );

    const expected: TreeData = {
      tree: { id: 1, name: "Tree1" },
      nodes: [
        {
          ...parentNode,
        },
        {
          ...childNode1,
        },
        {
          ...childNode2,
        },
        {
          ...grandChildNode1,
        },
        {
          ...grandChildNode2,
        },
        {
          ...greatGrandChildNode1,
          value: 1900,
        },
        {
          ...greatGrandChildNode2,
          value: 300000,
          valueFormat: "なし",
        },
        {
          ...greatGrandChildNode3,
          value: 700,
          valueFormat: "千",
        },
      ],
      layers: [
        { ...childLayer },
        {
          ...grandChildLayer,
        },
        {
          ...greatGrandChildLayer,
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it("ひ孫ノードを選択、親の親ノードのisValueLockedがtrue", () => {
    const {
      parentNode,
      childNode1,
      childNode2,
      childLayer,
      grandChildNode1,
      grandChildNode2,
      grandChildLayer,
      greatGrandChildNode1,
      greatGrandChildNode2,
      greatGrandChildNode3,
      greatGrandChildLayer,
    } = JSON.parse(JSON.stringify(fixtures));
    parentNode.isValueLocked = false;
    childNode1.isValueLocked = true;

    const treeData: TreeData = {
      tree: { id: 1, name: "Tree1" },
      nodes: [
        parentNode,
        childNode1,
        childNode2,
        grandChildNode1,
        grandChildNode2,
        greatGrandChildNode1,
        greatGrandChildNode2,
        greatGrandChildNode3,
      ],
      layers: [childLayer, grandChildLayer, greatGrandChildLayer],
    };

    const selectedNodes: Node[] = [
      greatGrandChildNode1,
      greatGrandChildNode2,
      greatGrandChildNode3,
    ];
    const selectedLayer: Layer = greatGrandChildLayer;

    selectedNodes[0].value = 1900;
    selectedNodes[1].value = 300000;
    selectedNodes[1].valueFormat = "なし";
    selectedNodes[2].value = 700;
    selectedNodes[2].valueFormat = "千";

    const result = propagateSelectedNodesChangesToTree(
      selectedNodes,
      selectedLayer,
      treeData
    );

    const expected: TreeData = {
      tree: { id: 1, name: "Tree1" },
      nodes: [
        {
          ...parentNode,
          value: 300, //変更されない
        },
        {
          ...childNode1,
          value: 100, //isValueLockedがtrueなので変更されない
        },
        {
          ...childNode2,
          value: 200,
        },
        {
          ...grandChildNode1,
          value: 2000,
        },
        {
          ...grandChildNode2,
          value: 10,
        },
        {
          ...greatGrandChildNode1,
          value: 1900,
        },
        {
          ...greatGrandChildNode2,
          value: 300000,
          valueFormat: "なし",
        },
        {
          ...greatGrandChildNode3,
          value: 700,
          valueFormat: "千",
        },
      ],
      layers: [
        { ...childLayer },
        {
          ...grandChildLayer,
        },
        {
          ...greatGrandChildLayer,
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it("ひ孫ノードを選択、選択したノードのisValueLockedがtrue", () => {
    const {
      parentNode,
      childNode1,
      childNode2,
      childLayer,
      grandChildNode1,
      grandChildNode2,
      grandChildLayer,
      greatGrandChildNode1,
      greatGrandChildNode2,
      greatGrandChildNode3,
      greatGrandChildLayer,
    } = JSON.parse(JSON.stringify(fixtures));
    parentNode.isValueLocked = false;
    greatGrandChildNode1.isValueLocked = true;

    const treeData: TreeData = {
      tree: { id: 1, name: "Tree1" },
      nodes: [
        parentNode,
        childNode1,
        childNode2,
        grandChildNode1,
        grandChildNode2,
        greatGrandChildNode1,
        greatGrandChildNode2,
        greatGrandChildNode3,
      ],
      layers: [childLayer, grandChildLayer, greatGrandChildLayer],
    };

    const selectedNodes: Node[] = [
      greatGrandChildNode1,
      greatGrandChildNode2,
      greatGrandChildNode3,
    ];
    const selectedLayer: Layer = greatGrandChildLayer;

    selectedNodes[0].value = 1900;
    selectedNodes[1].value = 300000;
    selectedNodes[1].valueFormat = "なし";
    selectedNodes[2].value = 700;
    selectedNodes[2].valueFormat = "千";

    const result = propagateSelectedNodesChangesToTree(
      selectedNodes,
      selectedLayer,
      treeData
    );

    const expected: TreeData = {
      tree: { id: 1, name: "Tree1" },
      nodes: [
        {
          ...parentNode,
          value: 400,
        },
        {
          ...childNode1,
          value: 200,
        },
        {
          ...childNode2,
          value: 200,
        },
        {
          ...grandChildNode1,
          value: 2000,
        },
        {
          ...grandChildNode2,
          value: 10,
        },
        {
          ...greatGrandChildNode1,
          value: 1900,
        },
        {
          ...greatGrandChildNode2,
          value: 300000,
          valueFormat: "なし",
        },
        {
          ...greatGrandChildNode3,
          value: 700,
          valueFormat: "千",
        },
      ],
      layers: [
        { ...childLayer },
        {
          ...grandChildLayer,
        },
        {
          ...greatGrandChildLayer,
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it("ひ孫ノードを選択、ルートノードのisValueLockedがtrue", () => {
    const {
      parentNode,
      childNode1,
      childNode2,
      childLayer,
      grandChildNode1,
      grandChildNode2,
      grandChildLayer,
      greatGrandChildNode1,
      greatGrandChildNode2,
      greatGrandChildNode3,
      greatGrandChildLayer,
    } = JSON.parse(JSON.stringify(fixtures));
    parentNode.isValueLocked = true;

    const treeData: TreeData = {
      tree: { id: 1, name: "Tree1" },
      nodes: [
        parentNode,
        childNode1,
        childNode2,
        grandChildNode1,
        grandChildNode2,
        greatGrandChildNode1,
        greatGrandChildNode2,
        greatGrandChildNode3,
      ],
      layers: [childLayer, grandChildLayer, greatGrandChildLayer],
    };

    const selectedNodes: Node[] = [
      greatGrandChildNode1,
      greatGrandChildNode2,
      greatGrandChildNode3,
    ];
    const selectedLayer: Layer = greatGrandChildLayer;

    selectedNodes[0].value = 1900;
    selectedNodes[1].value = 300000;
    selectedNodes[1].valueFormat = "なし";
    selectedNodes[2].value = 700;
    selectedNodes[2].valueFormat = "千";

    const result = propagateSelectedNodesChangesToTree(
      selectedNodes,
      selectedLayer,
      treeData
    );

    const expected: TreeData = {
      tree: { id: 1, name: "Tree1" },
      nodes: [
        {
          ...parentNode,
          value: 300, //isValueLockedがtrueのため、valueは変化しない
        },
        {
          ...childNode1,
          value: 200,
        },
        {
          ...childNode2,
          value: 200,
        },
        {
          ...grandChildNode1,
          value: 2000,
        },
        {
          ...grandChildNode2,
          value: 10,
        },
        {
          ...greatGrandChildNode1,
          value: 1900,
        },
        {
          ...greatGrandChildNode2,
          value: 300000,
          valueFormat: "なし",
        },
        {
          ...greatGrandChildNode3,
          value: 700,
          valueFormat: "千",
        },
      ],
      layers: [
        { ...childLayer },
        {
          ...grandChildLayer,
        },
        {
          ...greatGrandChildLayer,
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  // ルートノードを選択した時は、このメソッドは呼ばれないので、ルートノードを選択した時のテストは不要
  // it("ルートノードを選択");
});
