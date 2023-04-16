import { convertNodesToRawNodeDatum } from "../../app/javascript/convert_nodes_list_to_raw_node_datum";
import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";
import { Node, Layer } from "../../app/javascript/types";
import * as fixtures from "./__fixtures__/sample_data";
import { selectNodes } from "../../app/javascript/select_nodes";

const {
  parentNode,
  childNode1,
  childNode2,
  childLayer,
  grandChildNode1,
  grandChildNode2,
  grandChildLayer,
} = fixtures;
const nodes: Node[] = [
  parentNode,
  childNode1,
  childNode2,
  grandChildNode1,
  grandChildNode2,
];
const layers: Layer[] = [childLayer, grandChildLayer];
const rawNodeDatum = convertNodesToRawNodeDatum(nodes, layers);

describe("selectNodes", () => {
  describe("クリックしたノードが兄弟ノードを持たないノードの場合", () => {
    it("クリックしたノードのみが選択される", () => {
      const result = selectNodes(parentNode.id, rawNodeDatum);
      const expected: RawNodeDatum = {
        name: parentNode.name,
        attributes: {
          id: parentNode.id,
          value: parentNode.value,
          valueFormat: parentNode.value_format,
          unit: parentNode.unit,
          isValueLocked: parentNode.is_value_locked,
          operation: "",
          isLastInLayer: true,
          isSelected: true,
        },
        children: [
          {
            name: childNode1.name,
            attributes: {
              id: childNode1.id,
              value: childNode1.value,
              valueFormat: childNode1.value_format,
              unit: childNode1.unit,
              isValueLocked: childNode1.is_value_locked,
              operation: childLayer.operation,
              isLastInLayer: false,
              isSelected: false,
            },
            children: [
              {
                name: grandChildNode1.name,
                attributes: {
                  id: grandChildNode1.id,
                  value: grandChildNode1.value,
                  valueFormat: grandChildNode1.value_format,
                  unit: grandChildNode1.unit,
                  isValueLocked: grandChildNode1.is_value_locked,
                  operation: grandChildLayer.operation,
                  isLastInLayer: false,
                  isSelected: false,
                },
              },
              {
                name: grandChildNode2.name,
                attributes: {
                  id: grandChildNode2.id,
                  value: grandChildNode2.value,
                  valueFormat: grandChildNode2.value_format,
                  unit: grandChildNode2.unit,
                  isValueLocked: grandChildNode2.is_value_locked,
                  operation: grandChildLayer.operation,
                  isLastInLayer: true,
                  isSelected: false,
                },
              },
            ],
          },
          {
            name: childNode2.name,
            attributes: {
              id: childNode2.id,
              value: childNode2.value,
              valueFormat: childNode2.value_format,
              unit: childNode2.unit,
              isValueLocked: childNode2.is_value_locked,
              operation: childLayer.operation,
              isLastInLayer: true,
              isSelected: false,
            },
          },
        ],
      };
      expect(result).toEqual(expected);
    });
  });
  describe("クリックしたノードが兄弟ノードを持つノードの場合", () => {
    it("クリックしたノードとその兄弟ノードが選択される", () => {
      const result = selectNodes(childNode1.id, rawNodeDatum);
      const expected: RawNodeDatum = {
        name: parentNode.name,
        attributes: {
          id: parentNode.id,
          value: parentNode.value,
          valueFormat: parentNode.value_format,
          unit: parentNode.unit,
          isValueLocked: parentNode.is_value_locked,
          operation: "",
          isLastInLayer: true,
          isSelected: false,
        },
        children: [
          {
            name: childNode1.name,
            attributes: {
              id: childNode1.id,
              value: childNode1.value,
              valueFormat: childNode1.value_format,
              unit: childNode1.unit,
              isValueLocked: childNode1.is_value_locked,
              operation: childLayer.operation,
              isLastInLayer: false,
              isSelected: true,
            },
            children: [
              {
                name: grandChildNode1.name,
                attributes: {
                  id: grandChildNode1.id,
                  value: grandChildNode1.value,
                  valueFormat: grandChildNode1.value_format,
                  unit: grandChildNode1.unit,
                  isValueLocked: grandChildNode1.is_value_locked,
                  operation: grandChildLayer.operation,
                  isLastInLayer: false,
                  isSelected: false,
                },
              },
              {
                name: grandChildNode2.name,
                attributes: {
                  id: grandChildNode2.id,
                  value: grandChildNode2.value,
                  valueFormat: grandChildNode2.value_format,
                  unit: grandChildNode2.unit,
                  isValueLocked: grandChildNode2.is_value_locked,
                  operation: grandChildLayer.operation,
                  isLastInLayer: true,
                  isSelected: false,
                },
              },
            ],
          },
          {
            name: childNode2.name,
            attributes: {
              id: childNode2.id,
              value: childNode2.value,
              valueFormat: childNode2.value_format,
              unit: childNode2.unit,
              isValueLocked: childNode2.is_value_locked,
              operation: childLayer.operation,
              isLastInLayer: true,
              isSelected: true,
            },
          },
        ],
      };
      expect(result).toEqual(expected);
    });
  });
  describe("2回目以降のクリック", () => {
    it("クリックしたノードが選択済みの場合、選択されたままになる", () => {
      const firstSelected = selectNodes(childNode1.id, rawNodeDatum);
      const result = selectNodes(childNode1.id, firstSelected);
      const expected: RawNodeDatum = {
        name: parentNode.name,
        attributes: {
          id: parentNode.id,
          value: parentNode.value,
          valueFormat: parentNode.value_format,
          unit: parentNode.unit,
          isValueLocked: parentNode.is_value_locked,
          operation: "",
          isLastInLayer: true,
          isSelected: false,
        },
        children: [
          {
            name: childNode1.name,
            attributes: {
              id: childNode1.id,
              value: childNode1.value,
              valueFormat: childNode1.value_format,
              unit: childNode1.unit,
              isValueLocked: childNode1.is_value_locked,
              operation: childLayer.operation,
              isLastInLayer: false,
              isSelected: true,
            },
            children: [
              {
                name: grandChildNode1.name,
                attributes: {
                  id: grandChildNode1.id,
                  value: grandChildNode1.value,
                  valueFormat: grandChildNode1.value_format,
                  unit: grandChildNode1.unit,
                  isValueLocked: grandChildNode1.is_value_locked,
                  operation: grandChildLayer.operation,
                  isLastInLayer: false,
                  isSelected: false,
                },
              },
              {
                name: grandChildNode2.name,
                attributes: {
                  id: grandChildNode2.id,
                  value: grandChildNode2.value,
                  valueFormat: grandChildNode2.value_format,
                  unit: grandChildNode2.unit,
                  isValueLocked: grandChildNode2.is_value_locked,
                  operation: grandChildLayer.operation,
                  isLastInLayer: true,
                  isSelected: false,
                },
              },
            ],
          },
          {
            name: childNode2.name,
            attributes: {
              id: childNode2.id,
              value: childNode2.value,
              valueFormat: childNode2.value_format,
              unit: childNode2.unit,
              isValueLocked: childNode2.is_value_locked,
              operation: childLayer.operation,
              isLastInLayer: true,
              isSelected: true,
            },
          },
        ],
      };
      expect(result).toEqual(expected);
    });
    it("クリックしたノードが選択されていない場合、選択される。前回選択されていたノードの選択は解除される", () => {
      const firstSelected = selectNodes(childNode1.id, rawNodeDatum);
      const result = selectNodes(grandChildNode1.id, firstSelected);
      const expected: RawNodeDatum = {
        name: parentNode.name,
        attributes: {
          id: parentNode.id,
          value: parentNode.value,
          valueFormat: parentNode.value_format,
          unit: parentNode.unit,
          isValueLocked: parentNode.is_value_locked,
          operation: "",
          isLastInLayer: true,
          isSelected: false,
        },
        children: [
          {
            name: childNode1.name,
            attributes: {
              id: childNode1.id,
              value: childNode1.value,
              valueFormat: childNode1.value_format,
              unit: childNode1.unit,
              isValueLocked: childNode1.is_value_locked,
              operation: childLayer.operation,
              isLastInLayer: false,
              isSelected: false,
            },
            children: [
              {
                name: grandChildNode1.name,
                attributes: {
                  id: grandChildNode1.id,
                  value: grandChildNode1.value,
                  valueFormat: grandChildNode1.value_format,
                  unit: grandChildNode1.unit,
                  isValueLocked: grandChildNode1.is_value_locked,
                  operation: grandChildLayer.operation,
                  isLastInLayer: false,
                  isSelected: true,
                },
              },
              {
                name: grandChildNode2.name,
                attributes: {
                  id: grandChildNode2.id,
                  value: grandChildNode2.value,
                  valueFormat: grandChildNode2.value_format,
                  unit: grandChildNode2.unit,
                  isValueLocked: grandChildNode2.is_value_locked,
                  operation: grandChildLayer.operation,
                  isLastInLayer: true,
                  isSelected: true,
                },
              },
            ],
          },
          {
            name: childNode2.name,
            attributes: {
              id: childNode2.id,
              value: childNode2.value,
              valueFormat: childNode2.value_format,
              unit: childNode2.unit,
              isValueLocked: childNode2.is_value_locked,
              operation: childLayer.operation,
              isLastInLayer: true,
              isSelected: false,
            },
          },
        ],
      };
      expect(result).toEqual(expected);
    });
  });
});