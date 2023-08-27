import { updateAttributeByIds } from "@/updateAttributeByIds";
import { WrappedRawNodeDatum } from "@/types";

describe("updateAttributeByIds", () => {
  const originalRawNodeDatum: WrappedRawNodeDatum = {
    name: "Node 1",
    attributes: {
      id: 1,
      value: 200,
      valueFormat: "なし",
      unit: "",
      isValueLocked: false,
      operation: "",
      isLastInLayer: true,
      isSelected: false,
      isHovered: false,
      isLeaf: false,
    },
    children: [
      {
        name: "Node 2",
        attributes: {
          id: 2,
          value: 150,
          valueFormat: "なし",
          unit: "",
          isValueLocked: false,
          operation: "add",
          isLastInLayer: false,
          isSelected: false,
          isHovered: false,
          isLeaf: true,
        },
        children: [],
      },
      {
        name: "Node 3",
        attributes: {
          id: 3,
          value: 50,
          valueFormat: "なし",
          unit: "",
          isValueLocked: false,
          operation: "add",
          isLastInLayer: true,
          isSelected: false,
          isHovered: false,
          isLeaf: false,
        },
        children: [
          {
            name: "Node 4",
            attributes: {
              id: 4,
              value: 5,
              valueFormat: "なし",
              unit: "",
              isValueLocked: false,
              operation: "multiply",
              isLastInLayer: false,
              isSelected: false,
              isHovered: false,
              isLeaf: true,
            },
            children: [],
          },
          {
            name: "Node 5",
            attributes: {
              id: 5,
              value: 10,
              valueFormat: "なし",
              unit: "",
              isValueLocked: false,
              operation: "multiply",
              isLastInLayer: true,
              isSelected: false,
              isHovered: false,
              isLeaf: true,
            },
            children: [],
          },
        ],
      },
    ],
  };

  describe("isSelectedを指定したとき", () => {
    it("targetIdsに指定されたノードIDのisSelectedをtrueにし、その他のノードのisSelectedはfalseにする", () => {
      const rawNodeDatum: WrappedRawNodeDatum = JSON.parse(
        JSON.stringify(originalRawNodeDatum)
      );
      const targetIds = [2, 4];
      const attributeName = "isSelected";
      const updatedRawNodeDatum = updateAttributeByIds(
        attributeName,
        targetIds,
        rawNodeDatum
      );

      const updatedNode1 = updatedRawNodeDatum;
      const updatedNode2 = updatedRawNodeDatum.children?.[0];
      const updatedNode3 = updatedRawNodeDatum.children?.[1];
      const updatedNode4 = updatedRawNodeDatum.children?.[1].children?.[0];
      const updatedNode5 = updatedRawNodeDatum.children?.[1].children?.[1];

      expect(updatedNode1).toBeDefined();
      expect(updatedNode2).toBeDefined();
      expect(updatedNode3).toBeDefined();
      expect(updatedNode4).toBeDefined();
      expect(updatedNode5).toBeDefined();
      expect(updatedNode2?.attributes).toBeDefined();
      expect(updatedNode3?.attributes).toBeDefined();
      expect(updatedNode4?.attributes).toBeDefined();
      expect(updatedNode5?.attributes).toBeDefined();

      expect(updatedNode1.attributes.isSelected).toBe(false);
      expect(updatedNode1.attributes.isHovered).toBe(false);
      expect(updatedNode2?.attributes?.isSelected).toBe(true);
      expect(updatedNode2?.attributes?.isHovered).toBe(false);
      expect(updatedNode3?.attributes?.isSelected).toBe(false);
      expect(updatedNode3?.attributes?.isHovered).toBe(false);
      expect(updatedNode4?.attributes?.isSelected).toBe(true);
      expect(updatedNode4?.attributes?.isHovered).toBe(false);
      expect(updatedNode5?.attributes?.isSelected).toBe(false);
      expect(updatedNode5?.attributes?.isHovered).toBe(false);
    });

    it("targetIdsが空のときは、すべてのノードのisSelectedをfalseにする", () => {
      const rawNodeDatum: WrappedRawNodeDatum = JSON.parse(
        JSON.stringify(originalRawNodeDatum)
      );
      const targetIds: number[] = [];
      const attributeName = "isSelected";
      const updatedRawNodeDatum = updateAttributeByIds(
        attributeName,
        targetIds,
        rawNodeDatum
      );

      const updatedNode1 = updatedRawNodeDatum;
      const updatedNode2 = updatedRawNodeDatum.children?.[0];
      const updatedNode3 = updatedRawNodeDatum.children?.[1];
      const updatedNode4 = updatedRawNodeDatum.children?.[1].children?.[0];
      const updatedNode5 = updatedRawNodeDatum.children?.[1].children?.[1];

      expect(updatedNode1).toBeDefined();
      expect(updatedNode2).toBeDefined();
      expect(updatedNode3).toBeDefined();
      expect(updatedNode4).toBeDefined();
      expect(updatedNode5).toBeDefined();
      expect(updatedNode2?.attributes).toBeDefined();
      expect(updatedNode3?.attributes).toBeDefined();
      expect(updatedNode4?.attributes).toBeDefined();
      expect(updatedNode5?.attributes).toBeDefined();

      expect(updatedNode1.attributes.isSelected).toBe(false);
      expect(updatedNode1.attributes.isHovered).toBe(false);
      expect(updatedNode2?.attributes?.isSelected).toBe(false);
      expect(updatedNode2?.attributes?.isHovered).toBe(false);
      expect(updatedNode3?.attributes?.isSelected).toBe(false);
      expect(updatedNode3?.attributes?.isHovered).toBe(false);
      expect(updatedNode4?.attributes?.isSelected).toBe(false);
      expect(updatedNode4?.attributes?.isHovered).toBe(false);
      expect(updatedNode5?.attributes?.isSelected).toBe(false);
      expect(updatedNode5?.attributes?.isHovered).toBe(false);
    });
  });

  describe("isHoveredを指定したとき", () => {
    it("targetIdsに指定されたノードIDのisHoveredをtrueにし、その他のノードのisHoveredはfalseにする", () => {
      const rawNodeDatum: WrappedRawNodeDatum = JSON.parse(
        JSON.stringify(originalRawNodeDatum)
      );
      const targetIds = [3];
      const attributeName = "isHovered";
      const updatedRawNodeDatum = updateAttributeByIds(
        attributeName,
        targetIds,
        rawNodeDatum
      );

      const updatedNode1 = updatedRawNodeDatum;
      const updatedNode2 = updatedRawNodeDatum.children?.[0];
      const updatedNode3 = updatedRawNodeDatum.children?.[1];
      const updatedNode4 = updatedRawNodeDatum.children?.[1].children?.[0];
      const updatedNode5 = updatedRawNodeDatum.children?.[1].children?.[1];

      expect(updatedNode1).toBeDefined();
      expect(updatedNode2).toBeDefined();
      expect(updatedNode3).toBeDefined();
      expect(updatedNode4).toBeDefined();
      expect(updatedNode5).toBeDefined();
      expect(updatedNode2?.attributes).toBeDefined();
      expect(updatedNode3?.attributes).toBeDefined();
      expect(updatedNode4?.attributes).toBeDefined();
      expect(updatedNode5?.attributes).toBeDefined();

      expect(updatedNode1.attributes.isSelected).toBe(false);
      expect(updatedNode1.attributes.isHovered).toBe(false);
      expect(updatedNode2?.attributes?.isSelected).toBe(false);
      expect(updatedNode2?.attributes?.isHovered).toBe(false);
      expect(updatedNode3?.attributes?.isSelected).toBe(false);
      expect(updatedNode3?.attributes?.isHovered).toBe(true);
      expect(updatedNode4?.attributes?.isSelected).toBe(false);
      expect(updatedNode4?.attributes?.isHovered).toBe(false);
      expect(updatedNode5?.attributes?.isSelected).toBe(false);
      expect(updatedNode5?.attributes?.isHovered).toBe(false);
    });

    it("targetIdsが空のときは、すべてのノードのisHoveredをfalseにする", () => {
      const rawNodeDatum: WrappedRawNodeDatum = JSON.parse(
        JSON.stringify(originalRawNodeDatum)
      );
      const targetIds: number[] = [];
      const attributeName = "isHovered";
      const updatedRawNodeDatum = updateAttributeByIds(
        attributeName,
        targetIds,
        rawNodeDatum
      );

      const updatedNode1 = updatedRawNodeDatum;
      const updatedNode2 = updatedRawNodeDatum.children?.[0];
      const updatedNode3 = updatedRawNodeDatum.children?.[1];
      const updatedNode4 = updatedRawNodeDatum.children?.[1].children?.[0];
      const updatedNode5 = updatedRawNodeDatum.children?.[1].children?.[1];

      expect(updatedNode1).toBeDefined();
      expect(updatedNode2).toBeDefined();
      expect(updatedNode3).toBeDefined();
      expect(updatedNode4).toBeDefined();
      expect(updatedNode5).toBeDefined();
      expect(updatedNode2?.attributes).toBeDefined();
      expect(updatedNode3?.attributes).toBeDefined();
      expect(updatedNode4?.attributes).toBeDefined();
      expect(updatedNode5?.attributes).toBeDefined();

      expect(updatedNode1.attributes.isSelected).toBe(false);
      expect(updatedNode1.attributes.isHovered).toBe(false);
      expect(updatedNode2?.attributes?.isSelected).toBe(false);
      expect(updatedNode2?.attributes?.isHovered).toBe(false);
      expect(updatedNode3?.attributes?.isSelected).toBe(false);
      expect(updatedNode3?.attributes?.isHovered).toBe(false);
      expect(updatedNode4?.attributes?.isSelected).toBe(false);
      expect(updatedNode4?.attributes?.isHovered).toBe(false);
      expect(updatedNode5?.attributes?.isSelected).toBe(false);
      expect(updatedNode5?.attributes?.isHovered).toBe(false);
    });
  });
});
