import React from "react";
import { createRoot } from "react-dom/client";
import { ArcherContainer, ArcherElement } from "react-archer";
const rootStyle = {
  display: "flex",
  justifyContent: "center",
};
const rowStyle = {
  margin: "200px 0",
  display: "flex",
  justifyContent: "space-between",
};
const boxStyle = {
  padding: "10px",
  border: "1px solid black",
};

const SecondExample = () => {
  const [nbElements, setNbElements] = React.useState(2);
  return (
    <div
      style={{
        height: "500px",
        margin: "50px",
      }}
    >
      <div>
        <div>子階層1に要素を追加</div>
        <button
          data-cy="add-element"
          onClick={() => setNbElements(nbElements + 1)}
        >
          +
        </button>
        <button
          onClick={() => setNbElements(nbElements > 1 ? nbElements - 1 : 0)}
        >
          -
        </button>
      </div>
      <div>
        <div>子階層2に要素を追加</div>
        <button
          data-cy="add-element"
          onClick={() => setNbElements(nbElements + 1)}
        >
          +
        </button>
        <button
          onClick={() => setNbElements(nbElements > 1 ? nbElements - 1 : 0)}
        >
          -
        </button>
      </div>
      <hr></hr>
      <ArcherContainer strokeColor="red" lineStyle="angle">
        <div style={rootStyle}>
          <ArcherElement
            id="sales"
            relations={[
              {
                targetId: "element0",
                targetAnchor: "top",
                sourceAnchor: "bottom",
              },
              {
                targetId: "element1",
                targetAnchor: "top",
                sourceAnchor: "bottom",
              },
            ]}
          >
            <div style={boxStyle}>
              売上
              <hr></hr>
              100
            </div>
          </ArcherElement>
        </div>
        <div style={rowStyle}>
          {Array(nbElements)
            .fill(0)
            .map((_, i) => (
              <ArcherElement key={`element${i}`} id={`element${i}`}>
                <div style={boxStyle}>Element {i}</div>
              </ArcherElement>
            ))}
        </div>
      </ArcherContainer>
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("app");
  createRoot(container).render(<SecondExample></SecondExample>);
  3;
});
