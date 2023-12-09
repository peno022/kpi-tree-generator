import React from "react";

type Props = {
  name: string;
  value: number | string;
  displayUnit: string;
  elementId: number | string;
};

const NodeValue: React.FC<Props> = ({
  name,
  value,
  displayUnit,
  elementId,
}) => {
  return (
    <div className="flex flex-col" id={`calc-member-${elementId}`}>
      <div className="text-xs">{name}</div>
      <div className="text-base">
        {value.toLocaleString()}
        {displayUnit}
      </div>
    </div>
  );
};

export default NodeValue;
