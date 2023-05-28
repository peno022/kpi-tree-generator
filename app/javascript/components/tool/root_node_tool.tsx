import React, { useState } from "react";
import RootNodeDetail from "./nodeDetailArea/root_node_detail";
import { Node } from "../../types";

type RootNodeToolProps = {
  selectedRootNode: Node;
};

const RootNodeTool: React.FC<RootNodeToolProps> = ({ selectedRootNode }) => {
  const [nodeInfo, setNodeInfo] = useState<Node>(selectedRootNode);

  const handleNodeInfoChange = (updatedNodeInfo: Node) => {
    setNodeInfo(updatedNodeInfo);
  };
  return (
    <>
      <div className="relative flex flex-col h-full">
        <div className="absolute inset-0 overflow-y-auto p-2 pb-20" id="tool">
          <RootNodeDetail
            node={nodeInfo}
            handleNodeInfoChange={handleNodeInfoChange}
          />
        </div>
        <div
          className="absolute bottom-0 w-full flex justify-center items-center border-t-2 border-base-300 bg-base-100 mt-auto p-2"
          id="updateButton"
        >
          <button className="btn btn-primary">更新</button>
        </div>
      </div>
    </>
  );
};

export default RootNodeTool;
