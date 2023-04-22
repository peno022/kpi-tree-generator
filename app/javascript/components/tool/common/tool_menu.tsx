import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

type MenuItem = {
  label: string;
  onClick: () => void;
};
type Props = {
  menuItems: MenuItem[];
};

export const ToolMenu: React.FC<Props> = ({ menuItems }) => {
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
          {menuItems.map((item, index) => (
            <li key={index} onClick={item.onClick}>
              <a href="#">{item.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
