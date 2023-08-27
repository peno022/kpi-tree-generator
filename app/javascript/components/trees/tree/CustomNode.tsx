import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { CustomNodeElementProps } from "react-d3-tree/lib/types/types/common";
import CustomNodeButton from "./CustomNodeButton";
export interface CustomNodeProps extends CustomNodeElementProps {
  createNewChildLayerAndNodes: (parentNodeId: number) => void;
}

const CustomNode = ({
  nodeDatum,
  onNodeClick,
  onNodeMouseOver,
  onNodeMouseOut,
  createNewChildLayerAndNodes,
}: CustomNodeProps) => {
  const handleAddLayerButtonClick = () => {
    console.log("CustomNode handleClick");
    if (
      nodeDatum.attributes?.id &&
      typeof nodeDatum.attributes?.id === "number"
    ) {
      createNewChildLayerAndNodes(nodeDatum.attributes.id);
    }
  };
  return (
    <g>
      <g>
        <rect
          x="-85"
          y="-5"
          style={{
            width: "170",
            height: "170",
            fill: "transparent",
            stroke: "transparent",
            strokeWidth: "0",
          }}
          onMouseOut={onNodeMouseOut}
        ></rect>
        <g
          onClick={onNodeClick}
          onMouseOver={onNodeMouseOver}
          className="custom-node"
        >
          <rect
            x="-75"
            rx="5"
            ry="5"
            style={
              nodeDatum.attributes?.isSelected
                ? {
                    width: "150",
                    height: "85",
                    fill: "moccasin",
                    stroke: "dimgray",
                    strokeWidth: "1",
                  }
                : {
                    width: "150",
                    height: "85",
                    fill: "ghostwhite",
                    stroke: "dimgray",
                    strokeWidth: "1",
                  }
            }
          />
          <text
            x="-60"
            y="38"
            style={{
              fill: "#333",
              strokeWidth: "0",
              fontWeight: "bold",
              fontSize: "1.2em",
              maxWidth: "280",
            }}
          >
            {nodeDatum.name}
          </text>
          {nodeDatum.attributes?.isValueLocked && (
            <FontAwesomeIcon
              icon={faLock}
              width={20}
              height={20}
              x={45}
              y={10}
              style={{
                color: "dimgray",
              }}
            />
          )}
          <text
            x="-60"
            y="65"
            style={{
              fill: "#333",
              strokeWidth: "0",
              fontSize: "1em",
              maxWidth: "280",
            }}
          >
            {nodeDatum.attributes?.value}
            {nodeDatum.attributes?.valueFormat === "なし"
              ? ""
              : nodeDatum.attributes?.valueFormat}
            {nodeDatum.attributes?.unit}
          </text>
        </g>
      </g>

      <g>
        <text
          x="130"
          y="42"
          style={{
            fill: "#333",
            strokeWidth: "0",
            fontWeight: "bold",
            fontSize: "1.5em",
            maxWidth: "280",
          }}
        >
          {nodeDatum.attributes?.operation === "add" &&
            !nodeDatum.attributes?.isLastInLayer &&
            "＋"}
          {nodeDatum.attributes?.operation === "multiply" &&
            !nodeDatum.attributes?.isLastInLayer &&
            "×"}
        </text>
      </g>
      {nodeDatum.attributes?.isHovered && nodeDatum.attributes?.isLeaf && (
        <CustomNodeButton
          handleClick={handleAddLayerButtonClick}
          onMouseOver={onNodeMouseOver}
        ></CustomNodeButton>
      )}
    </g>
  );
};

export default CustomNode;
