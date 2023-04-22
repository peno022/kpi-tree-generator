import React from "react";

type Props = {
  type: "over" | "under";
  diffValue: number;
  parentValue: number;
  displayUnit: string;
};

const MessageBubble: React.FC<Props> = ({
  type,
  diffValue,
  parentValue,
  displayUnit,
}) => {
  return (
    <div className="relative bg-base-200 rounded p-1 w-max mt-2.5">
      <div className="absolute top-0 left-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-t-0 border-transparent border-b-base-200 -translate-y-full"></div>
      <p className="text-error font-semibold">
        {diffValue.toLocaleString()}
        {displayUnit}
        {type === "under" ? "不足" : "超過"}（親要素:
        {parentValue.toLocaleString()}
        {displayUnit}）
      </p>
    </div>
  );
};

export default MessageBubble;
