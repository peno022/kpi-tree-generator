import React, { useEffect, useState } from "react";
import NodeDetail from "./nodeDetailArea/NodeDetail";
import { Node, Layer, TreeData } from "../../../types";
import ToolMenu from "../../shared/ToolMenu";
import Operations from "./operationArea/operations";
import Calculation from "./calculationArea/calculation";
import OpenModalButton from "../../shared/OpenModalButton";
import propagateSelectedNodesChangesToTree from "../../../propagete_selected_nodes_changes_to_tree";
import { useTreeUpdate } from "../../../hooks/use_tree_update";
import AlertError from "../../shared/AlertError";

type LayerToolProps = {
  selectedNodes: Node[];
  selectedLayer: Layer;
  parentNode: Node;
  onUpdateSuccess: (updatedTreeData: TreeData) => void;
  treeData: TreeData;
};

export type LayerToolState = {
  nodes: Node[];
  layer: Layer;
};

const LayerTool: React.FC<LayerToolProps> = ({
  selectedNodes,
  selectedLayer,
  parentNode,
  onUpdateSuccess,
  treeData,
}) => {
  const { errorMessage, sendUpdateRequest, setErrorMessage } = useTreeUpdate(
    treeData.tree.id
  );
  const [layerProperty, setlayerProperty] = useState<LayerToolState>({
    nodes: selectedNodes,
    layer: selectedLayer,
  });
  const [inputFraction, setInputFraction] = useState<string>(
    selectedLayer.fraction.toString()
  );
  const [nodeValidationResults, setNodeValidationResults] = useState<boolean[]>(
    Array(selectedNodes.length).fill(true)
  );
  const [fractionValidation, setFractionValidation] = useState(true);
  const [fractionErrorMessage, setFractionErrorMessage] = useState<
    string | null
  >(null);
  const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(true);

  const isAllValid = (results: boolean[]): boolean => {
    return results.every((result) => result);
  };

  useEffect(() => {
    setlayerProperty({
      ...layerProperty,
      nodes: selectedNodes,
      layer: selectedLayer,
    });
    setInputFraction(selectedLayer.fraction.toString());
    setFractionValidation(true);
    setNodeValidationResults(Array(selectedNodes.length).fill(true));
    setFractionErrorMessage(null);
    setErrorMessage(null);
  }, [selectedNodes, selectedLayer, parentNode]);

  useEffect(() => {
    setIsUpdateButtonDisabled(
      !isAllValid(nodeValidationResults) || !fractionValidation
    );
  }, [nodeValidationResults, fractionValidation]);

  const handleNodeInfoChange = (index: number, newNodeInfo: Node) => {
    const newValues = [...layerProperty.nodes];
    newValues[index] = newNodeInfo;
    setlayerProperty({
      ...layerProperty,
      nodes: newValues,
    });
  };

  const handleNodeValidationResultsChange = (
    index: number,
    isValid: boolean
  ) => {
    const newValues = [...nodeValidationResults];
    newValues[index] = isValid;
    setNodeValidationResults(newValues);
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

  const saveLayerProperty = async () => {
    const result = await sendUpdateRequest(
      propagateSelectedNodesChangesToTree(
        layerProperty.nodes,
        layerProperty.layer,
        treeData
      )
    );
    if (result) {
      onUpdateSuccess(result);
    }
  };

  return (
    <>
      <div className="relative flex flex-col h-full">
        <div className="absolute inset-0 overflow-y-auto p-2 pb-20 tool">
          {errorMessage && <AlertError message={errorMessage} />}
          <div className="flex justify-between">
            <div className="text-base font-semibold label-operation">
              要素間の関係
            </div>
            <ToolMenu
              menuItems={[
                {
                  label: "階層を削除",
                  onClick: () => {
                    console.log("階層を削除");
                  },
                },
              ]}
            />
          </div>
          <div className="mb-4">
            <Operations
              selectedLayer={layerProperty.layer}
              handleOperationChange={handleOperationChange}
            />
          </div>
          <div className="mb-4 calculation">
            <Calculation
              selectedNodes={layerProperty.nodes}
              selectedLayer={layerProperty.layer}
              inputFraction={inputFraction}
              fractionValidation={fractionValidation}
              fractionErrorMessage={fractionErrorMessage}
              parentNode={parentNode}
              handleFractionChange={handleFractionChange}
            ></Calculation>
          </div>
          {layerProperty.nodes.map((node, index) => (
            <NodeDetail
              key={node.id}
              index={index}
              node={node}
              handleNodeInfoChange={handleNodeInfoChange}
              setNodeValidationResult={handleNodeValidationResultsChange}
            />
          ))}
          <div className="flex justify-center">
            <button className="btn btn-sm btn-outline mt-2">要素を追加</button>
          </div>
        </div>
        <div
          className="absolute bottom-0 w-full flex justify-center items-center border-t-2 border-base-300 bg-base-100 mt-auto p-2"
          id="updateButton"
        >
          <OpenModalButton
            buttonText="更新"
            disabled={isUpdateButtonDisabled}
            modalButtonText="更新する"
            modalHeadline=""
            modaltext="データを更新してよろしいですか？"
            modalId="updateLayerModal"
            handleClick={saveLayerProperty}
          ></OpenModalButton>
        </div>
      </div>
    </>
  );
};

export default LayerTool;