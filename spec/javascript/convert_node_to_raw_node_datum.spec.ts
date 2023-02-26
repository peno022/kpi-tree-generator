import convertNodeToRawNodeDatum from "../../app/javascript/convert_node_to_raw_node_datum";
import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";
import * as types from "../../app/javascript/types";

describe("convertNodeToRawNodeDatum", () => {
  describe("Childrenがない単体のノード", () => {
    it("単体ノード1つに対して、1つのRawNodeDatumを返す", () => {
      const node: types.Node = {
        id: 1,
        name: "単体ノード",
        value: 100,
        value_format: "なし",
        unit: "円",
        is_value_locked: false,
      };

      const expected: RawNodeDatum = {
        name: "単体ノード",
        attributes: {
          value: 100,
          valueFormat: "なし",
          unit: "円",
          isValueLocked: false,
        },
      };
      expect(convertNodeToRawNodeDatum(node)).toEqual(expected);
    });

    it("unitが空文字であれば、空文字のままRawNodeDatumのattributesにセットする", () => {
      const node: types.Node = {
        id: 1,
        name: "単体ノード",
        value: 100,
        value_format: "なし",
        unit: "",
        is_value_locked: false,
      };

      const expected: RawNodeDatum = {
        name: "単体ノード",
        attributes: {
          value: 100,
          valueFormat: "なし",
          unit: "",
          isValueLocked: false,
        },
      };
      expect(convertNodeToRawNodeDatum(node)).toEqual(expected);
    });

    it("valueが小数のときも、変換後のvalueと値が等しくなる", () => {
      const node: types.Node = {
        id: 1,
        name: "単体ノード",
        value: 1.3,
        value_format: "なし",
        unit: "回",
        is_value_locked: false,
      };

      const expected: RawNodeDatum = {
        name: "単体ノード",
        attributes: {
          value: 1.3,
          valueFormat: "なし",
          unit: "回",
          isValueLocked: false,
        },
      };
      expect(convertNodeToRawNodeDatum(node)).toEqual(expected);
    });
  });
  describe("Childrenがあるノード", () => {
    it("Childrenが入ったRawNodeDatumを返す", () => {
      const node: types.Node = {
        id: 1,
        name: "子ありノード",
        value: 300,
        value_format: "なし",
        unit: "円",
        is_value_locked: false,
        child_layer: {
          id: 1,
          operation: "たし算",
        },
        children: [
          {
            id: 2,
            name: "子1-1",
            value: 100,
            value_format: "なし",
            unit: "円",
            is_value_locked: false,
          },
          {
            id: 3,
            name: "子1-2",
            value: 200,
            value_format: "なし",
            unit: "円",
            is_value_locked: false,
          },
        ],
      };

      const expected: RawNodeDatum = {
        name: "子ありノード",
        attributes: {
          value: 300,
          valueFormat: "なし",
          unit: "円",
          isValueLocked: false,
        },
        children: [
          {
            name: "子1-1",
            attributes: {
              value: 100,
              valueFormat: "なし",
              unit: "円",
              isValueLocked: false,
            },
          },
          {
            name: "子1-2",
            attributes: {
              value: 200,
              valueFormat: "なし",
              unit: "円",
              isValueLocked: false,
            },
          },
        ],
      };
      expect(convertNodeToRawNodeDatum(node)).toEqual(expected);
    });
  });
  describe("ChildrenのChildrenがあるノード", () => {
    it("ChildrenのChildrenまで入れ子になったRawNodeDatumを返す", () => {
      const node: types.Node = {
        id: 1,
        name: "孫ありノード",
        value: 300,
        value_format: "なし",
        unit: "円",
        is_value_locked: false,
        child_layer: {
          id: 1,
          operation: "たし算",
        },
        children: [
          {
            id: 2,
            name: "子1-1",
            value: 100,
            value_format: "なし",
            unit: "円",
            is_value_locked: false,
            child_layer: {
              id: 1,
              operation: "かけ算",
            },
            children: [
              {
                id: 4,
                name: "子1-1-1",
                value: 10,
                value_format: "なし",
                unit: "円",
                is_value_locked: true,
              },
              {
                id: 5,
                name: "子1-1-2",
                value: 10,
                value_format: "なし",
                unit: "人",
                is_value_locked: false,
              },
            ],
          },
          {
            id: 3,
            name: "子1-2",
            value: 200,
            value_format: "なし",
            unit: "円",
            is_value_locked: false,
          },
        ],
      };

      const expected: RawNodeDatum = {
        name: "孫ありノード",
        attributes: {
          value: 300,
          valueFormat: "なし",
          unit: "円",
          isValueLocked: false,
        },
        children: [
          {
            name: "子1-1",
            attributes: {
              value: 100,
              valueFormat: "なし",
              unit: "円",
              isValueLocked: false,
            },
            children: [
              {
                name: "子1-1-1",
                attributes: {
                  value: 10,
                  valueFormat: "なし",
                  unit: "円",
                  isValueLocked: true,
                },
              },
              {
                name: "子1-1-2",
                attributes: {
                  value: 10,
                  valueFormat: "なし",
                  unit: "人",
                  isValueLocked: false,
                },
              },
            ],
          },
          {
            name: "子1-2",
            attributes: {
              value: 200,
              valueFormat: "なし",
              unit: "円",
              isValueLocked: false,
            },
          },
        ],
      };
      expect(convertNodeToRawNodeDatum(node)).toEqual(expected);
    });
  });
});
