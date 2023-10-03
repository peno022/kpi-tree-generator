import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
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
    if (
      nodeDatum.attributes?.id &&
      typeof nodeDatum.attributes?.id === "number"
    ) {
      createNewChildLayerAndNodes(nodeDatum.attributes.id);
    }
  };

  // nodeDatum.nameを8文字ごとに分割
  const splitName = nodeDatum.name.match(/.{1,8}/g) || [];

  const displayValueFormat =
    nodeDatum.attributes?.valueFormat === "なし" || null || undefined
      ? ""
      : (nodeDatum.attributes?.valueFormat || "").toString();

  const displayValue =
    (nodeDatum.attributes?.value.toString() || "") +
    displayValueFormat +
    (nodeDatum.attributes?.unit || "");

  const splitDisplayValue =
    displayValue.length > 13
      ? [
          (nodeDatum.attributes?.value.toString() || "") + displayValueFormat,
          nodeDatum.attributes?.unit || "",
        ]
      : [displayValue];

  const displayNameOriginY = splitName.length > 1 ? 30 : 40;
  const displayValueOriginY = 75;

  return (
    <g id={`custom-node-${nodeDatum.attributes?.id.toString()}`}>
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
            x="-100"
            rx="5"
            ry="5"
            style={
              nodeDatum.attributes?.isSelected
                ? {
                    width: "200",
                    height: "100",
                    fill: "moccasin",
                    stroke: "dimgray",
                    strokeWidth: "1",
                  }
                : {
                    width: "200",
                    height: "100",
                    fill: "ghostwhite",
                    stroke: "dimgray",
                    strokeWidth: "1",
                  }
            }
          />
          {splitName.map((str, index) => (
            <text
              key={index}
              x="-90"
              y={displayNameOriginY + index * 20}
              style={{
                fill: "#333C4D",
                strokeWidth: "0",
                fontWeight: "bold",
                fontSize: "1.2em",
              }}
            >
              {str}
            </text>
          ))}
          {nodeDatum.attributes?.isValueLocked && (
            <FontAwesomeIcon
              icon={faLock}
              width={20}
              height={20}
              x={70}
              y={10}
              style={{
                color: "dimgray",
              }}
            />
          )}
          {splitDisplayValue.map((str, index) => (
            <text
              key={index}
              x="-90"
              y={displayValueOriginY + index * 20}
              style={{
                fill: "#333C4D",
                strokeWidth: "0",
                fontSize: "1.1em",
              }}
            >
              {str}
            </text>
          ))}
        </g>
      </g>

      <g>
        <g className="inconsistent-value-icon">
          {nodeDatum.attributes?.hasInconsistentValue && (
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              width={30}
              height={30}
              x={-35}
              y={-37}
              style={{
                color: "#F87272",
              }}
            />
          )}
        </g>
        <text
          x="130"
          y="42"
          style={{
            fill: "#333C4D",
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
