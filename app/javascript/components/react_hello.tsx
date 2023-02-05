import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Tree from "react-d3-tree";
import { RawNodeDatum } from 'react-d3-tree/lib/types/types/common'


const orgChart: any = {
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

const OrgChartTree = () => {
  const [data, setData] = useState(orgChart);
  const emptyLayer: Array<RawNodeDatum> = [
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
          className="btn btn-primary"
        >
          <span>追加</span>
        </button>
      </div>
      <div id="treeWrapper" style={{ width: "50em", height: "50em" }}>
        <Tree
          data={data}
          pathFunc="step"
          orientation="vertical"
          renderCustomNodeElement={({ nodeDatum }) => {
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
          }}
        />
      </div>
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("app") as HTMLElement;
  createRoot(container).render(<OrgChartTree />);
});
