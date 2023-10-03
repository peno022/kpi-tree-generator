import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ToolArea from "@/components/trees/tool/ToolArea";
import { TreeArea } from "@/components/trees/tree/TreeArea";
import { TreeNodeEventCallback } from "react-d3-tree/lib/types/Tree/types";
import { TreeDataFromApi } from "@/types";
import { ErrorBoundary } from "react-error-boundary";
import keysToCamelCase from "@/keysToCamelCase";
import html2canvas from "html2canvas";
import Loading from "@/components/shared/Loading";

const EditTreePage = () => {
  const treeId = document.getElementById("tree")?.getAttribute("data-tree-id");

  const [treeData, setTreeData] = useState<TreeDataFromApi>({
    tree: { id: 0, name: "" },
    nodes: [],
    layers: [],
  });
  const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);
  const [isLoading, setisLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getTreeSize = () => {
    const svgElement = document.querySelector("#treeWrapper svg");
    if (!svgElement) return null;

    const bbox = (svgElement as SVGSVGElement).getBBox();
    return {
      width: bbox.width,
      height: bbox.height,
      x: bbox.x,
      y: bbox.y,
    };
  };

  const fitTreeToView = () => {
    const treeSize = getTreeSize();
    if (!treeSize) return;

    const svgElement = document.querySelector("#treeWrapper svg");
    if (!svgElement) return;

    svgElement.setAttribute(
      "viewBox",
      `${treeSize.x} ${treeSize.y} ${treeSize.width} ${treeSize.height}`
    );
  };

  const downloadImage = async () => {
    fitTreeToView();
    const treeElement = document.getElementById("treeWrapper");
    if (!treeElement) return;
    const canvas = await html2canvas(treeElement);
    const dataURL = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "tree.png";
    a.click();
  };

  useEffect(() => {
    const buttons = document.querySelectorAll("[data-action='download-image']");
    buttons.forEach((button) => {
      button.addEventListener("click", downloadImage);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", downloadImage);
      });
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      setErrorMessage(null);
      setisLoading(true);
      const response = await fetch(`/api/trees/${treeId}.json`);
      if (!response.ok) {
        setErrorMessage(
          "エラーが発生しています。時間をおいて再度お試しください。"
        );
        setisLoading(false);
        return;
      }
      setTreeData(keysToCamelCase(await response.json()));
      setisLoading(false);
    };
    load();
  }, [treeId]);

  if (isLoading) return <Loading></Loading>;

  const handleClick: TreeNodeEventCallback = (node) => {
    const clickedNodeId = node.data?.attributes?.id;
    const clickedNode = treeData.nodes.find(
      (node) => node.id === clickedNodeId
    );
    if (!clickedNode) {
      setErrorMessage(
        "エラーが発生しています。画面を再読み込みしてもう一度お試しください。"
      );
    } else if (clickedNode.parentId === null) {
      setSelectedNodeIds([clickedNode.id]);
    } else {
      const siblings = treeData.nodes.filter(
        (node) => node.parentId === clickedNode.parentId
      );
      setSelectedNodeIds(siblings.map((node) => node.id));
    }
  };

  const handleUpdateSuccess = (
    updatedTreeData: TreeDataFromApi,
    selectedNodeIds: number[] = []
  ) => {
    setTreeData(updatedTreeData);
    setSelectedNodeIds(selectedNodeIds);
  };

  const isLargeScreen = window.innerWidth >= 1024;

  if (errorMessage) {
    return (
      <div role="alert" className="text-error mx-auto my-8 font-bold">
        {errorMessage}
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col lg:flex-row w-full">
        <div>{isUpdating && <Loading></Loading>}</div>
        <div
          className="flex-1 ml-1 h-1/2 lg:h-auto"
          id="treeWrapper"
          style={{
            flexGrow: isLargeScreen ? 2 : 1,
            flexBasis: 0,
          }}
        >
          <ErrorBoundary fallbackRender={fallbackRender}>
            <TreeArea
              treeData={treeData}
              selectedNodeIds={selectedNodeIds}
              handleClick={handleClick}
              onUpdateSuccess={handleUpdateSuccess}
              onUpdateStatusChange={(status: boolean) => setIsUpdating(status)}
            />
          </ErrorBoundary>
        </div>
        <div
          className="flex-1 border-t-2 lg:border-l-2 lg:border-t-0 border-base-300 mr-1 h-1/2 lg:h-auto"
          id="toolWrapper"
          style={{
            flexGrow: 1,
            flexBasis: 0,
          }}
        >
          <ErrorBoundary fallbackRender={fallbackRender}>
            <ToolArea
              treeData={treeData}
              selectedNodeIds={selectedNodeIds}
              onUpdateSuccess={handleUpdateSuccess}
              onUpdateStatusChange={(status: boolean) => setIsUpdating(status)}
            />
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
};

function fallbackRender() {
  return (
    <div role="alert" className="text-error font-bold">
      エラーが発生しています。時間をおいて再度お試しください。
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tree") as HTMLElement;
  if (container) {
    createRoot(container).render(<EditTreePage />);
  }
});
