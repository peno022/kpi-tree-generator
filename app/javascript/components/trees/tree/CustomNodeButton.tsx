import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDown } from "@fortawesome/free-solid-svg-icons";
import { SyntheticEventHandler } from "react-d3-tree/lib/types/types/common";

type CustomNodeButtonProps = {
  handleClick: () => void;
  onMouseOver: SyntheticEventHandler;
};

const CustomNodeButton: React.FC<CustomNodeButtonProps> = ({
  handleClick,
  onMouseOver,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseOut = () => {
    console.log("CustomNodeButton handleMouseOut");
    setIsHovered(false);
  };
  const handleMouseOver = () => {
    console.log("CustomNodeButton handleMouseOver");
    setIsHovered(true);
  };

  return (
    <g onMouseOut={handleMouseOut} onMouseOver={handleMouseOver}>
      <g
        onClick={handleClick}
        onMouseOver={onMouseOver}
        className={`add-layer-button ${isHovered ? "hovered" : ""}`}
      >
        <rect
          width={40}
          height={40}
          x={-20}
          y={110}
          fill="transparent"
          stroke="transparent"
        ></rect>
        <circle
          cx={0}
          cy={130}
          r={30}
          fill="transparent"
          style={
            isHovered
              ? {
                  stroke: "#252B37", // daisyUI theme color: "neutral-focus"
                }
              : { stroke: "transparent" } // daisyUI theme color: "neutral"
          }
        ></circle>
        <FontAwesomeIcon
          icon={faCircleDown}
          width={40}
          height={40}
          x={-20}
          y={110}
          style={
            isHovered
              ? {
                  color: "#252B37", // daisyUI theme color: "neutral-focus"
                }
              : { color: "#333C4D" } // daisyUI theme color: "neutral"
          }
        />
      </g>
    </g>
  );
};

export default CustomNodeButton;
