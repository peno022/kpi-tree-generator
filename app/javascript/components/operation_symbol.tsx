import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus, faEquals } from "@fortawesome/free-solid-svg-icons";

type Props = {
  operation: "multiply" | "add" | "equal";
};

const OperationSymbol: React.FC<Props> = ({ operation }) => {
  let element;
  switch (operation) {
    case "multiply":
      element = <FontAwesomeIcon icon={faXmark} />;
      break;
    case "add":
      element = <FontAwesomeIcon icon={faPlus} />;
      break;
    case "equal":
      element = <FontAwesomeIcon icon={faEquals} />;
      break;
  }

  return <div>{element}</div>;
};

export default OperationSymbol;
