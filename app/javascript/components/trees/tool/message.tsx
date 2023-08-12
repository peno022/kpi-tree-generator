import React from "react";

type MessageProps = {
  text: string;
};

const Message: React.FC<MessageProps> = ({ text }) => {
  return (
    <div className="p-2 text-center mt-6">
      <p className="">{text}</p>
    </div>
  );
};

export default Message;
