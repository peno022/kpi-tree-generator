import React from "react";

const Fraction: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="text-xs">端数</div>
      <input type="text" placeholder="数値を入力" className="input input-xs " />
    </div>
  );
};

export default Fraction;
