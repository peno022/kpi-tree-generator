/**
 * @jest-environment node
 */

import { convertNodesToRawNodeDatum } from "@/convertNodesToRawNodeDatum";
import { LayerFromApi, NodeFromApi, WrappedRawNodeDatum } from "@/types";
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
      const nodes: NodeFromApi[] = [parentNode];
      const layers: LayerFromApi[] = [];
      const expected: WrappedRawNodeDatum = {
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
          isHovered: false,
          isLeaf: true,
          hasInconsistentValue: false,
        },
      };
      expect(convertNodesToRawNodeDatum(nodes, layers)).toEqual(expected);
    });
  });
  describe("Childrenがあるノード", () => {
    it("子ノードのRawNodeDatumをchildrenに持つRawNodeDatumを返す", () => {
      const nodes: NodeFromApi[] = [parentNode, childNode1, childNode2];
      const layers: LayerFromApi[] = [childLayer];
      const expected: WrappedRawNodeDatum = {
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
          isHovered: false,
          isLeaf: false,
          hasInconsistentValue: false,
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
              isHovered: false,
              isLeaf: true,
              hasInconsistentValue: false,
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
              isSelected: false,
              isHovered: false,
              isLeaf: true,
              hasInconsistentValue: false,
            },
          },
        ],
      };
      expect(convertNodesToRawNodeDatum(nodes, layers)).toEqual(expected);
    });
    it("子ノード・子レイヤーの計算結果が親ノードの値と合わない時、子ノード全員のhasInconsistentValueがtrueになる", () => {
      const inconsistentChild1: NodeFromApi = {
        ...childNode1,
        value: 50,
        valueFormat: "万",
      };
      const inconsistentChild2: NodeFromApi = {
        ...childNode2,
        value: 60,
        valueFormat: "万",
      };
      const nodes: NodeFromApi[] = [
        parentNode,
        inconsistentChild1,
        inconsistentChild2,
      ];
      const layers: LayerFromApi[] = [childLayer];
      const expected: WrappedRawNodeDatum = {
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
          isHovered: false,
          isLeaf: false,
          hasInconsistentValue: false,
        },
        children: [
          {
            name: inconsistentChild1.name,
            attributes: {
              id: inconsistentChild1.id,
              value: inconsistentChild1.value,
              valueFormat: inconsistentChild1.valueFormat,
              unit: inconsistentChild1.unit,
              isValueLocked: inconsistentChild1.isValueLocked,
              operation: childLayer.operation,
              isLastInLayer: false,
              isSelected: false,
              isHovered: false,
              isLeaf: true,
              hasInconsistentValue: true,
            },
          },
          {
            name: inconsistentChild2.name,
            attributes: {
              id: inconsistentChild2.id,
              value: inconsistentChild2.value,
              valueFormat: inconsistentChild2.valueFormat,
              unit: inconsistentChild2.unit,
              isValueLocked: inconsistentChild2.isValueLocked,
              operation: childLayer.operation,
              isLastInLayer: true,
              isSelected: false,
              isHovered: false,
              isLeaf: true,
              hasInconsistentValue: true,
            },
          },
        ],
      };
      expect(convertNodesToRawNodeDatum(nodes, layers)).toEqual(expected);
    });
  });
  describe("孫ノードがあるノード", () => {
    it("孫ノードのRawNodeDatumをchildrenに持つRawNodeDatumを返す", () => {
      const nodes: NodeFromApi[] = [
        parentNode,
        childNode1,
        childNode2,
        grandChildNode1,
        grandChildNode2,
      ];
      const layers: LayerFromApi[] = [childLayer, grandChildLayer];
      const expected: WrappedRawNodeDatum = {
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
          isHovered: false,
          isLeaf: false,
          hasInconsistentValue: false,
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
              isHovered: false,
              isLeaf: false,
              hasInconsistentValue: false,
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
                  isHovered: false,
                  isLeaf: true,
                  hasInconsistentValue: false,
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
                  isHovered: false,
                  isLeaf: true,
                  hasInconsistentValue: false,
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
              isHovered: false,
              isLeaf: true,
              hasInconsistentValue: false,
            },
          },
        ],
      };
      expect(convertNodesToRawNodeDatum(nodes, layers)).toEqual(expected);
    });
  });
});
