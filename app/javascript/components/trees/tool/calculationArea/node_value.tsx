import React from "react";

type Props = {
  name: string;
  value: number;
  displayUnit: string;
};

const NodeValue: React.FC<Props> = ({ name, value, displayUnit }) => {
  return (
    <div className="flex flex-col">
      <div className="text-xs">{name}</div>
      <div className="text-base">
        {value.toLocaleString()}
        {displayUnit}
      </div>
    </div>
  );
};

export default NodeValue;
