import { useState } from "react";
import { NavBtn } from "../NavBtn";
import { useCurrentUser } from "../../../../context/UserContext";
import RolEnum from "../../../../utils/RolEnum";

export const NavDropdown = ({ title, children, showArrow, className, left, roles, ...props }) => {
  const [open, setOpen] = useState(false);

  const { rol: validRol } = useCurrentUser();
  if (roles && (!roles?.includes(RolEnum.ADMIN) || !roles?.includes(validRol))) return <></>;

  return (
    <div
      className="d-lg-inline-block"
      onClick={() => setOpen(!open)}
      onMouseLeave={() => setOpen(false)}
      style={{ minWidth: "fit-content"}}
    >
      <div className="dropdown w-100">
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
          style={{ width: "fit-content", display: open ? "block" : "none" ,  left:` ${left && "auto"} `, right: `${left && "0"}`}}
          className={`dropdown-menu dropdown-menu-lg-start overflow-hidden mx-auto shadow-lg border-0 rounded-2 p-0`}
        >
          {children}
        </ul>
      </div>
    </div>
  );
};
