import { useState } from "react";
import { Node, Layer, NodeFromApi } from "@/types";

const useLayerToolLogic = (
  selectedNodes: NodeFromApi[],
  selectedLayer: Layer,
  parentNode: NodeFromApi,
  setFractionValidation: React.Dispatch<React.SetStateAction<boolean>>,
  setFractionErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const [layerProperty, setlayerProperty] = useState<{
    nodes: Node[];
    layer: Layer;
  }>({
    nodes: selectedNodes,
    layer: selectedLayer,
  });

  const [inputFraction, setInputFraction] = useState<string>(
    selectedLayer.fraction.toString()
  );

  const handleNodeInfoChange = (index: number, newNodeInfo: Node) => {
    const newValues = [...layerProperty.nodes];
    newValues[index] = newNodeInfo;
    setlayerProperty({
      ...layerProperty,
      nodes: newValues,
    });
  };

  const handleOperationChange = (operation: "multiply" | "add") => {
    const newLayerValues = { ...layerProperty.layer };
    newLayerValues.operation = operation;
    setlayerProperty({
      ...layerProperty,
      layer: newLayerValues,
    });
  };

  const handleFractionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFraction = e.target.value;
    const newLayerValues = { ...layerProperty.layer };
    setInputFraction(inputFraction);
    const numericValue = Number(inputFraction);
    if (isNaN(numericValue)) {
      setFractionValidation(false);
      setFractionErrorMessage("数値を入力してください");
      newLayerValues.fraction = 0;
      setlayerProperty({
        ...layerProperty,
        layer: newLayerValues,
      });
      return;
    }
    newLayerValues.fraction = numericValue;
    setFractionValidation(true);
    setFractionErrorMessage(null);
    setlayerProperty({
      ...layerProperty,
      layer: newLayerValues,
    });
  };

  const addNode = () => {
    const newNodes = [...layerProperty.nodes];
    let initialValue: number;
    if (layerProperty.layer.operation === "multiply") {
      initialValue = 1;
    } else {
      initialValue = 0;
    }
    newNodes.push({
      name: `要素${newNodes.length + 1}`,
      value: initialValue,
      unit: "",
      valueFormat: "なし",
      isValueLocked: false,
      parentId: parentNode.id,
    });
    setlayerProperty({
      ...layerProperty,
      nodes: newNodes,
    });
  };

  return {
    layerProperty,
    setlayerProperty,
    addNode,
    handleNodeInfoChange,
    handleOperationChange,
    handleFractionChange,
    inputFraction,
    setInputFraction,
  };
};

export default useLayerToolLogic;
