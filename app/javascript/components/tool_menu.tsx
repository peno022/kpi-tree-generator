import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

export const ToolMenu = () => {
  return (
    <>
      <div className="dropdown dropdown-bottom dropdown-end">
        <label tabIndex={0} className="btn btn-ghost">
          <FontAwesomeIcon icon={faEllipsis} />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a>この階層を削除</a>
          </li>
        </ul>
      </div>
    </>
  );
};
