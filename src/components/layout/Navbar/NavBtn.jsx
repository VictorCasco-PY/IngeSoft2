import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import { NavButton } from "./styles/NavButton";
import { NavButtonBase } from "./styles/NavButtonBase";
import { NavBtnDropdownStyle } from "./styles/NavBtnDropdownStyle";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../../context/UserContext";
import RolEnum from "../../../utils/RolEnum";

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

export const NavBtn = ({
  children,
  icon,
  type,
  href,
  className,
  roles,
  ...props
}) => {
  const [selected, setSelected] = useState(false);
  const { rol: validRol } = useCurrentUser();

  const location = useLocation();

  useEffect(() => {
    setSelected(location.pathname.includes(href));
  }, [location]);

  // Validamos que el rol del usuario actual sea el mismo que el rol requerido para mostrar el botón.
  // Si el rol del usuario actual no es el mismo que el rol requerido, no se muestra el botón.
  // El admin puede ver todos los botones, por lo que no se valida su rol.
  if (roles && !roles?.includes(validRol)) return <></>;

  switch (type) {
    case "base":
      return (
        <BtnNavbarBase href={href ?? "#"} className={className} {...props}>
          <BtnContent icon={icon}>{children}</BtnContent>
        </BtnNavbarBase>
      );
    case "dropdownItem":
      return (
        <BtnNavbarDropdown
          href={href ?? "#"}
          className={`${selected && "selected"} ${className}`}
          {...props}
        >
          <BtnContent icon={icon}>{children}</BtnContent>
        </BtnNavbarDropdown>
      );
    default:
      return (
        <BtnNavbar
          href={href ?? "#"}
          className={`d-block  d-lg-inline-flex ${
            selected && "selected"
          } ${className}`}
          {...props}
        >
          <BtnContent icon={icon}>{children}</BtnContent>
        </BtnNavbar>
      );
  }
};
