import React, { useEffect, useState } from "react";
import NodeDetail from "./nodeDetailArea/node_detail";
import { Node, Layer, TreeData } from "../../types";
import ToolMenu from "./common/tool_menu";
import Operations from "./operationArea/operations";
import Calculation from "./calculationArea/calculation";
import OpenModalButton from "./common/open_modal_button";

type LayerToolProps = {
  selectedNodes: Node[];
  selectedLayer: Layer;
  parentNode: Node;
  onUpdateSuccess: (updatedTreeData: TreeData) => void;
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
}) => {
  const [layerProperty, setlayerProperty] = useState<LayerToolState>({
    nodes: selectedNodes,
    layer: selectedLayer,
  });
  const [nodeValidationResults, setNodeValidationResults] = useState<boolean[]>(
    Array(selectedNodes.length).fill(true)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedState, setSavedState] = useState<LayerToolState | null>(null);
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
  }, [selectedNodes, selectedLayer, parentNode]);

  useEffect(() => {
    setIsUpdateButtonDisabled(!isAllValid(nodeValidationResults));
  }, [nodeValidationResults]);

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

  const handleFractionChange = (fraction: number) => {
    const newLayerValues = { ...layerProperty.layer };
    newLayerValues.fraction = fraction;
    setlayerProperty({
      ...layerProperty,
      layer: newLayerValues,
    });
  };

  const saveLayerProperty = async () => {
    setErrorMessage(null);
    setSavedState(layerProperty);

    // TODO: 更新用APIを呼び出す
    try {
      const response = await fetch("/api/v1/layers/" + selectedLayer.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          layer: layerProperty.layer,
          nodes: layerProperty.nodes,
        }),
      });
      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }
      const json = await response.json();
      onUpdateSuccess(json);
    } catch (err) {
      setErrorMessage("更新に失敗しました。");
    }
  };

  return (
    <>
      <div className="relative flex flex-col h-full">
        <div className="absolute inset-0 overflow-y-auto p-2 pb-20" id="tool">
          <div className="flex justify-between items-center mb-1.5">
            <div className="text-base font-semibold">要素間の関係</div>
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
          <div className="mb-4">
            <Calculation
              selectedNodes={layerProperty.nodes}
              selectedLayer={layerProperty.layer}
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
            <button className="btn btn-sm btn-outline">要素を追加</button>
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
