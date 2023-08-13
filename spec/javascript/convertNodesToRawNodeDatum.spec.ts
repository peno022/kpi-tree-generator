/**
 * @jest-environment node
 */

import { convertNodesToRawNodeDatum } from "@/convertNodesToRawNodeDatum";
import { RawNodeDatum } from "react-d3-tree/lib/types/types/common";
import { Node, Layer } from "@/types";
import * as fixtures from "@spec/__fixtures__/sampleData";

const {
  parentNode,
  childNode1,
  childNode2,
  childLayer,
  grandChildNode1,
  grandChildNode2,
  grandChildLayer,
} = fixtures;

describe("convertNodesToRawNodeDatum", () => {
  describe("Childrenがない単体のノード", () => {
    it("単体ノード1つに対して、1つのRawNodeDatumを返す", () => {
      const nodes: Node[] = [parentNode];
      const layers: Layer[] = [];
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
        },
      };
      expect(convertNodesToRawNodeDatum(nodes, layers)).toEqual(expected);
    });
  });
  describe("Childrenがあるノード", () => {
    it("子ノードのRawNodeDatumをchildrenに持つRawNodeDatumを返す", () => {
      const nodes: Node[] = [parentNode, childNode1, childNode2];
      const layers: Layer[] = [childLayer];
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
            },
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
            },
          },
        ],
      };
      expect(convertNodesToRawNodeDatum(nodes, layers)).toEqual(expected);
    });
  });
  describe("孫ノードがあるノード", () => {
    it("孫ノードのRawNodeDatumをchildrenに持つRawNodeDatumを返す", () => {
      const nodes: Node[] = [
        parentNode,
        childNode1,
        childNode2,
        grandChildNode1,
        grandChildNode2,
      ];
      const layers: Layer[] = [childLayer, grandChildLayer];
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
            },
          },
        ],
      };
      expect(convertNodesToRawNodeDatum(nodes, layers)).toEqual(expected);
    });
  });
});
