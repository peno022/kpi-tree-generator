import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full absolute top-0 left-0">
      <div className="flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 absolute top-1/3 left-1/2">
        <div className="loading loading-spinner loading-lg mb-4"></div>
        <div className="text-xl">Loading...</div>
      </div>
    </div>
  );
};

export default Loading;
