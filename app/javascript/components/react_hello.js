import React from "react";
import { createRoot } from "react-dom/client";
import Tree from "react-d3-tree";

const orgChart = {
  name: "CEO",
  children: [
    {
      name: "Manager",
      attributes: {
        department: "Production",
      },
      children: [
        {
          name: "Foreman",
          attributes: {
            department: "Fabrication",
          },
          children: [
            {
              name: "Worker",
              children: [
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
              ],
            },
            {
              name: "Worker",
              children: [
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
              ],
            },
            {
              name: "Worker",
              children: [
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
              ],
            },
            {
              name: "Worker",
              children: [
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
              ],
            },
          ],
        },
        {
          name: "Foreman",
          attributes: {
            department: "Assembly",
          },
          children: [
            {
              name: "Worker",
              children: [
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
              ],
            },
            {
              name: "Worker",
              children: [
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
              ],
            },
            {
              name: "Worker",
              children: [
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
                {
                  name: "Worker",
                },
              ],
            },
          ],
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
        y="60"
        style={{
          fill: "#333",
          strokeWidth: "0",
          fontSize: "0.9em",
          maxWidth: "280",
        }}
      >
        {`部署：${nodeDatum.attributes?.department}`}
      </text>
    </g>
  );
};

const OrgChartTree = () => {
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{ width: "50em", height: "50em" }}>
      <Tree
        data={orgChart}
        pathFunc="step"
        orientation="vertical"
        renderCustomNodeElement={customNodeElement}
      />
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("app");
  createRoot(container).render(<OrgChartTree />);
});
