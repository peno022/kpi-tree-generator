import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import * as types from "react-d3-tree/lib/types/types/common";

const CustomNode: types.RenderCustomNodeElementFn = ({
  nodeDatum,
  onNodeClick,
}: types.CustomNodeElementProps) => {
  return (
    <g>
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
        onClick={onNodeClick}
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
      <text></text>
    </g>
  );
};

export default CustomNode;
