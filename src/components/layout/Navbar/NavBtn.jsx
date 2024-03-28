import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import { NavButton } from "./styles/NavButton";
import { NavButtonBase } from "./styles/NavButtonBase";
import { NavBtnDropdownStyle } from "./styles/NavBtnDropdownStyle";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const BtnNavbar = styled(Button)(() => NavButton);
const BtnNavbarBase = styled(Button)(() => NavButtonBase);
const BtnNavbarDropdown = styled(Button)(() => NavBtnDropdownStyle);

const BtnContent = ({ icon, children }) => {
  return (
    <>
      {children}
      {icon ? <span className="icon">{icon}</span> : <></>}
    </>
  );
};

export const NavBtn = ({ children, icon, type, href, className, ...props }) => {

  const [selected, setSelected] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setSelected(location.pathname.includes(href));
  }, [location]);

  switch (type) {
    case "base":
      return (
          <BtnNavbarBase href={href ?? "#"} className={className} {...props}>
            <BtnContent icon={icon}>{children}</BtnContent>
          </BtnNavbarBase>
      );
    case "dropdownItem":
      return (
          <BtnNavbarDropdown href={href ?? "#"} className={`${selected&&"selected"} ${className}`} {...props}>
            <BtnContent icon={icon}>{children}</BtnContent>
          </BtnNavbarDropdown>
      );
    default:
      return (
          <BtnNavbar  href={href ?? "#"} className={`d-block  d-lg-inline-flex ${selected&&"selected"} ${className}`} {...props}>
            <BtnContent icon={icon}>{children}</BtnContent>
          </BtnNavbar>
      );
  }
};
