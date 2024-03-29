import { useState } from "react";
import useFieldValidation from "@/hooks/useFieldValidation";
import { Node, Layer, NodeFromApi } from "@/types";

const useLayerToolLogic = (
  selectedNodes: NodeFromApi[],
  selectedLayer: Layer,
  parentNode: NodeFromApi
) => {
  const [layerProperty, setLayerProperty] = useState<{
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
    setLayerProperty({
      ...layerProperty,
      nodes: newValues,
    });
  };

  const handleOperationChange = (operation: "multiply" | "add") => {
    const newLayerValues = { ...layerProperty.layer };
    newLayerValues.operation = operation;
    setLayerProperty({
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
      setLayerProperty({
        ...layerProperty,
        layer: newLayerValues,
      });
      return;
    } else if (numericValue.toString().length > 9) {
      setFractionValidation(false);
      setFractionErrorMessage("9桁以内で入力してください");
      newLayerValues.fraction = 0;
      setLayerProperty({
        ...layerProperty,
        layer: newLayerValues,
      });
      return;
    }
    newLayerValues.fraction = numericValue;
    setFractionValidation(true);
    setFractionErrorMessage(null);
    setLayerProperty({
      ...layerProperty,
      layer: newLayerValues,
    });
  };

  const {
    fieldValidationErrors,
    handleFieldValidationErrorsChange,
    setFieldValidationErrors,
  } = useFieldValidation(layerProperty.nodes.length);

  const addNode = () => {
    let initialValue: number;
    if (layerProperty.layer.operation === "multiply") {
      initialValue = 1;
    } else {
      initialValue = 0;
    }
    const newNode: Node = {
      name: `要素${layerProperty.nodes.length + 1}`,
      value: initialValue,
      unit: "",
      valueFormat: "なし",
      isValueLocked: false,
      parentId: parentNode.id,
    };

    const newFieldValidationError = {
      name: "",
      unit: "",
      value: "",
      valueFormat: "",
      isValueLocked: "",
    };

    setLayerProperty((prevLayerProperty) => ({
      ...prevLayerProperty,
      nodes: [...prevLayerProperty.nodes, newNode],
    }));

    setFieldValidationErrors((prevErrors) => [
      ...prevErrors,
      newFieldValidationError,
    ]);
  };

  const deleteNode = (index: number) => {
    const newNodes = [...layerProperty.nodes];
    newNodes.splice(index, 1);
    setLayerProperty({
      ...layerProperty,
      nodes: newNodes,
    });
    setFieldValidationErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors.splice(index, 1);
      return newErrors;
    });
  };

  const deleteAllNodes = () => {
    setLayerProperty({
      ...layerProperty,
      nodes: [],
    });
    setFieldValidationErrors([]);
  };

  const [fractionValidation, setFractionValidation] = useState(true);
  const [fractionErrorMessage, setFractionErrorMessage] = useState<
    string | null
  >(null);

  const resetValidationResults = (length: number) => {
    setFieldValidationErrors(
      Array(length).fill({
        name: "",
        unit: "",
        value: "",
        valueFormat: "",
        isValueLocked: "",
      })
    );
    setFractionValidation(true);
    setFractionErrorMessage(null);
  };

  return {
    layerProperty,
    setlayerProperty: setLayerProperty,
    addNode,
    deleteNode,
    handleNodeInfoChange,
    handleOperationChange,
    handleFractionChange,
    inputFraction,
    setInputFraction,
    fieldValidationErrors,
    fractionValidation,
    fractionErrorMessage,
    handleFieldValidationErrorsChange,
    resetValidationResults,
    deleteAllNodes,
  };
};

export default useLayerToolLogic;
