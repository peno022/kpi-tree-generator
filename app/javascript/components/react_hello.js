import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Tree from "react-d3-tree";

const orgChart = {
  name: "売上金額",
  attributes: {
    value: 1000,
    unit: "万円",
  },
  children: [
    {
      name: "購入者数",
      attributes: {
        value: 5000,
        unit: "人",
      },
      children: [
        {
          name: "訪問者数",
          attributes: {
            value: 100000,
            unit: "人",
          },
          children: [],
        },
        {
          name: "購入率",
          attributes: {
            value: 0.05,
            unit: null,
          },
          children: [],
        },
      ],
    },
    {
      name: "顧客単価",
      attributes: {
        value: 2000,
        unit: "円",
      },
      children: [
        {
          name: "商品単価",
          attributes: {
            value: 200,
            unit: "円",
          },
          children: [],
        },
        {
          name: "購入商品数",
          attributes: {
            value: 10,
            unit: "個",
          },
          children: [],
        },
      ],
    },
  ],
};

const customNodeElement = ({ nodeDatum }) => {
  return (
    <g>
      <rect
        x="-75"
        rx="5"
        ry="5"
        style={{
          width: "150",
          height: "85",
          fill: "ghostwhite",
          stroke: "dimgray",
          strokeWidth: "1",
        }}
      />
      <text
        x="-60"
        y="38"
        style={{
          fill: "#333",
          strokeWidth: "0",
          fontWeight: "bold",
          fontSize: "1.4em",
          maxWidth: "280",
        }}
      >
        {nodeDatum.name}
      </text>
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
        {nodeDatum.attributes?.unit}
      </text>
    </g>
  );
};

const OrgChartTree = () => {
  const [data, setData] = useState(orgChart);
  const emptyLayer = [
    {
      name: "xxx",
      attributes: {
        value: 0,
        unit: "",
      },
      children: [],
    },
    {
      name: "xxx",
      attributes: {
        value: 0,
        unit: "",
      },
      children: [],
    },
  ];
  return (
    <div>
      <div>
        <div className="underline">「訪問者数」の下に階層を追加</div>
        <button
          onClick={() => {
            console.log("button clicked");
            console.log(data);
            console.log(data.children);
            console.log(emptyLayer);
            data.children[0].children[0].children.push(...emptyLayer);
            const newData = JSON.parse(JSON.stringify(data));
            setData(newData);
          }}
          className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
        >
          <span>追加</span>
        </button>
      </div>
      <div id="treeWrapper" style={{ width: "50em", height: "50em" }}>
        <Tree
          data={data}
          pathFunc="step"
          orientation="vertical"
          renderCustomNodeElement={customNodeElement}
        />
      </div>
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("app");
  createRoot(container).render(<OrgChartTree />);
});
