import React, { useEffect, useState } from "react";
import NodeDetail from "./nodeDetailArea/node_detail";
import { Node, Layer, TreeData } from "../../types";
import ToolMenu from "./common/tool_menu";
import Operations from "./operationArea/operations";
import Calculation from "./calculationArea/calculation";
import OpenModalButton from "./common/open_modal_button";
import propagateSelectedNodesChangesToTree from "../../propagete_selected_nodes_changes_to_tree";
import keysToSnakeCase from "../../keys_to_snake_case";
import keysToCamelCase from "../../keys_to_camel_case";

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

    const treeDataToSave = propagateSelectedNodesChangesToTree(
      layerProperty.nodes,
      layerProperty.layer,
      treeData
    );

    const bodyData = JSON.stringify({
      tree: {
        layers: keysToSnakeCase(
          treeDataToSave.layers.map((layer) => {
            return {
              ...layer,
              parentNodeId:
                layer.parentNodeId === 0 ? null : layer.parentNodeId,
            };
          })
        ),
        nodes: keysToSnakeCase(
          treeDataToSave.nodes.map((node) => {
            return {
              ...node,
              parentId: node.parentId === 0 ? null : node.parentId,
            };
          })
        ),
      },
    });

    console.log("---------- REQUEST -----------");
    console.log({
      tree: {
        layers: keysToSnakeCase(
          treeDataToSave.layers.map((layer) => {
            return {
              ...layer,
              parentNodeId:
                layer.parentNodeId === 0 ? null : layer.parentNodeId,
            };
          })
        ),
        nodes: keysToSnakeCase(
          treeDataToSave.nodes.map((node) => {
            return {
              ...node,
              parentId: node.parentId === 0 ? null : node.parentId,
            };
          })
        ),
      },
    });

    try {
      const response = await fetch("/api/trees/" + treeData.tree.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-Token": token(),
        },
        credentials: "same-origin",
        body: bodyData,
      });
      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }
      const json = await response.json();
      console.log("---------- SUCCESS -----------");
      console.dir(keysToCamelCase(json));
      onUpdateSuccess(keysToCamelCase(json));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  function token(): string {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute("content") || "" : "";
  }

  return (
    <>
      <div className="relative flex flex-col h-full">
        <div className="absolute inset-0 overflow-y-auto p-2 pb-20" id="tool">
          <div className="flex justify-between items-center mb-1.5">
            <div className="text-error">{errorMessage ? errorMessage : ""}</div>
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
