import React, { useEffect } from "react";
import NodeDetail from "@/components/trees/tool/nodeDetailArea/NodeDetail";
import { Layer, NodeFromApi, TreeDataFromApi, TreeData } from "@/types";
import ToolMenu from "@/components/shared/ToolMenu";
import Operations from "@/components/trees/tool/operationArea/Operations";
import Calculation from "@/components/trees/tool/calculationArea/Calculation";
import OpenModalButton from "@/components/shared/OpenModalButton";
import propagateSelectedNodesChangesToTree from "@/propagateSelectedNodesChangesToTree";
import { useTreeUpdate } from "@/hooks/useTreeUpdate";
import AlertError from "@/components/shared/AlertError";
import useLayerToolLogic from "@/hooks/useLayerToolLogic";
import useUpdateButtonStatus from "@/hooks/useUpdateButtonStatus";

type LayerToolProps = {
  selectedNodes: NodeFromApi[];
  selectedLayer: Layer;
  parentNode: NodeFromApi;
  onUpdateSuccess: (updatedTreeData: TreeDataFromApi) => void;
  treeData: TreeDataFromApi;
  onUpdateStatusChange: (isUpdating: boolean) => void;
};

const LayerTool: React.FC<LayerToolProps> = ({
  selectedNodes,
  selectedLayer,
  parentNode,
  onUpdateSuccess,
  treeData,
  onUpdateStatusChange,
}) => {
  const { errorMessage, sendUpdateRequest, setErrorMessage, isUpdating } =
    useTreeUpdate(treeData.tree.id);

  const {
    layerProperty,
    setlayerProperty,
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
  } = useLayerToolLogic(selectedNodes, selectedLayer, parentNode);

  const isUpdateButtonDisabled = useUpdateButtonStatus(
    fieldValidationErrors,
    false,
    fractionValidation
  );

  useEffect(() => {
    setlayerProperty({
      nodes: selectedNodes,
      layer: selectedLayer,
    });
    setInputFraction(selectedLayer.fraction.toString());
    resetValidationResults(selectedNodes.length);
    setErrorMessage(null);
  }, [selectedNodes, selectedLayer, parentNode]);

  useEffect(() => {
    onUpdateStatusChange(isUpdating);
  }, [isUpdating]);

  const saveLayerProperty = async () => {
    let newTreeData: TreeData = JSON.parse(JSON.stringify(treeData));
    if (layerProperty.nodes.length === 0) {
      // treeDataのnodesからselectedNodesを削除する
      const newNodes = treeData.nodes.filter((node) => {
        return !selectedNodes.some((selectedNode) => {
          return node.id === selectedNode.id;
        });
      });
      newTreeData = {
        ...newTreeData,
        nodes: newNodes,
      };
    } else {
      newTreeData = propagateSelectedNodesChangesToTree(
        layerProperty.nodes,
        layerProperty.layer,
        treeData
      );
    }
    const result = await sendUpdateRequest(newTreeData);
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
            <div className="layer-tool-menu">
              <ToolMenu
                menuItems={[
                  {
                    label: "選択中の全要素を削除",
                    onClick: () => {
                      deleteAllNodes();
                    },
                  },
                ]}
              />
            </div>
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
              key={index}
              index={index}
              node={node}
              handleNodeInfoChange={handleNodeInfoChange}
              fieldValidationErrors={fieldValidationErrors[index]}
              handleFieldValidationErrorsChange={
                handleFieldValidationErrorsChange
              }
              isRoot={false}
              deleteNode={deleteNode}
            />
          ))}
          <div className="flex justify-center">
            <button className="btn btn-sm btn-outline mt-2" onClick={addNode}>
              要素を追加
            </button>
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
