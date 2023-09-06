import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ToolArea from "@/components/trees/tool/ToolArea";
import { TreeArea } from "@/components/trees/tree/TreeArea";
import { TreeNodeEventCallback } from "react-d3-tree/lib/types/Tree/types";
import { TreeDataFromApi } from "@/types";
import { ErrorBoundary } from "react-error-boundary";
import { FallbackProps } from "react-error-boundary/dist/react-error-boundary";
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
    console.log("treeElement", treeElement);
    if (!treeElement) return;
    const canvas = await html2canvas(treeElement);
    const dataURL = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "tree.png";
    a.click();
  };

  useEffect(() => {
    const button = document.querySelector("[data-action='download-image']");
    button?.addEventListener("click", downloadImage);

    return () => {
      button?.removeEventListener("click", downloadImage);
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      setisLoading(true);
      try {
        const responce = await fetch(`/api/trees/${treeId}.json`);
        setTreeData(keysToCamelCase(await responce.json()));
      } catch (err) {
        console.log(err);
        return <>エラーが発生しました。</>;
      } finally {
        setisLoading(false);
      }
    };
    load();
  }, [treeId]);

  if (isLoading) return <Loading></Loading>;

  const handleClick: TreeNodeEventCallback = (node) => {
    const clickedNodeId = node.data?.attributes?.id;
    console.log(`id:${clickedNodeId}: ${node.data.name}をクリック`);

    const clickedNode = treeData.nodes.find(
      (node) => node.id === clickedNodeId
    );
    if (!clickedNode) {
      // TODO: エラーメッセージの表示
      console.log("ERROR: clickedNode is not found");
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

  return (
    <>
      <div className="flex w-full">
        <div>{isUpdating && <Loading></Loading>}</div>
        <div
          className="flex-1 ml-1"
          id="treeWrapper"
          style={{
            flexGrow: 2,
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
          ;
        </div>
        <div
          className="flex-1 border-l-2 border-base-300 mr-1"
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

function fallbackRender({ error }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tree") as HTMLElement;
  if (container) {
    createRoot(container).render(<EditTreePage />);
  }
});
