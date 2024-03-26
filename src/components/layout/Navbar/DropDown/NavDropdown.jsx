import { useState } from "react";
import { NavBtn } from "../NavBtn";

export const NavDropdown = ({ title, children, showArrow, className, left,...props }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="d-inline-block"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ minWidth: "fit-content"}}
    >
      <div className="dropdown">
        <NavBtn
          style={
            open ? { color: "#7749F8", boxShadow: "0 5px 0 -1px #7749F8" } : {}
          }
          className={`${className} ${showArrow ? "dropdown-toggle" : ""}`}
          data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false"
          {...props}
        >
          {title}
        </NavBtn>
        <ul
          style={{ width: "fit-content", display: open ? "block" : "none" }}
          className={`dropdown-menu dropdown-menu-end dropdown-menu-lg-start overflow-hidden mx-auto shadow-lg border-0 rounded-2 p-0`}
        >
          {children}
        </ul>
      </div>
    </div>
  );
};
