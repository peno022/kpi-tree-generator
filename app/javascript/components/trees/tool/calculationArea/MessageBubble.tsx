import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

type Props = {
  diffValue: number;
  parentValue: number;
  displayUnit: string;
};

const MessageBubble: React.FC<Props> = ({
  diffValue,
  parentValue,
  displayUnit,
}) => {
  return (
    <div className="relative bg-base-200 rounded p-1 w-max mt-2.5">
      <div className="absolute top-0 left-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-t-0 border-transparent border-b-base-200 -translate-y-full"></div>
      <p className="text-error font-semibold">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          width={30}
          height={30}
          style={{
            color: "#F87272",
          }}
        />
        {diffValue > 0
          ? diffValue.toLocaleString()
          : (-diffValue).toLocaleString()}
        {displayUnit}
        {diffValue > 0 ? "超過" : "不足"}（親要素:
        {parentValue.toLocaleString()}
        {displayUnit}）
      </p>
    </div>
  );
};

export default MessageBubble;
