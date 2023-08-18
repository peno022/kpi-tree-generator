/**
 * @jest-environment node
 */

import { convertNodesToRawNodeDatum } from "@/convertNodesToRawNodeDatum";
import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";
import { NodeFromApi, LayerFromApi } from "@/types";
import * as fixtures from "@spec/__fixtures__/sampleData";
import { selectNodes } from "@/selectNodes";

const {
  parentNode,
  childNode1,
  childNode2,
  childLayer,
  grandChildNode1,
  grandChildNode2,
  grandChildLayer,
} = fixtures;
const nodes: NodeFromApi[] = [
  parentNode,
  childNode1,
  childNode2,
  grandChildNode1,
  grandChildNode2,
];
const layers: LayerFromApi[] = [childLayer, grandChildLayer];
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
          valueFormat: parentNode.valueFormat,
          unit: parentNode.unit,
          isValueLocked: parentNode.isValueLocked,
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
              valueFormat: childNode1.valueFormat,
              unit: childNode1.unit,
              isValueLocked: childNode1.isValueLocked,
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
                  valueFormat: grandChildNode1.valueFormat,
                  unit: grandChildNode1.unit,
                  isValueLocked: grandChildNode1.isValueLocked,
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
                  valueFormat: grandChildNode2.valueFormat,
                  unit: grandChildNode2.unit,
                  isValueLocked: grandChildNode2.isValueLocked,
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
              valueFormat: childNode2.valueFormat,
              unit: childNode2.unit,
              isValueLocked: childNode2.isValueLocked,
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
          valueFormat: parentNode.valueFormat,
          unit: parentNode.unit,
          isValueLocked: parentNode.isValueLocked,
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
              valueFormat: childNode1.valueFormat,
              unit: childNode1.unit,
              isValueLocked: childNode1.isValueLocked,
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
                  valueFormat: grandChildNode1.valueFormat,
                  unit: grandChildNode1.unit,
                  isValueLocked: grandChildNode1.isValueLocked,
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
                  valueFormat: grandChildNode2.valueFormat,
                  unit: grandChildNode2.unit,
                  isValueLocked: grandChildNode2.isValueLocked,
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
              valueFormat: childNode2.valueFormat,
              unit: childNode2.unit,
              isValueLocked: childNode2.isValueLocked,
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
          valueFormat: parentNode.valueFormat,
          unit: parentNode.unit,
          isValueLocked: parentNode.isValueLocked,
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
              valueFormat: childNode1.valueFormat,
              unit: childNode1.unit,
              isValueLocked: childNode1.isValueLocked,
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
                  valueFormat: grandChildNode1.valueFormat,
                  unit: grandChildNode1.unit,
                  isValueLocked: grandChildNode1.isValueLocked,
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
                  valueFormat: grandChildNode2.valueFormat,
                  unit: grandChildNode2.unit,
                  isValueLocked: grandChildNode2.isValueLocked,
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
              valueFormat: childNode2.valueFormat,
              unit: childNode2.unit,
              isValueLocked: childNode2.isValueLocked,
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
          valueFormat: parentNode.valueFormat,
          unit: parentNode.unit,
          isValueLocked: parentNode.isValueLocked,
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
              valueFormat: childNode1.valueFormat,
              unit: childNode1.unit,
              isValueLocked: childNode1.isValueLocked,
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
                  valueFormat: grandChildNode1.valueFormat,
                  unit: grandChildNode1.unit,
                  isValueLocked: grandChildNode1.isValueLocked,
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
                  valueFormat: grandChildNode2.valueFormat,
                  unit: grandChildNode2.unit,
                  isValueLocked: grandChildNode2.isValueLocked,
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
              valueFormat: childNode2.valueFormat,
              unit: childNode2.unit,
              isValueLocked: childNode2.isValueLocked,
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
