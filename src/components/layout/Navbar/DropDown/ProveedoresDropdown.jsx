import { useEffect, useState } from "react";
import { NavBtn } from "../NavBtn";
import { NavDropdown } from "./NavDropdown";
import { useLocation } from "react-router-dom";

export const ProveedoresDropdown = () => {
  const location = useLocation();
  const [isSelected , setIsSelected] = useState(false)

    useEffect(() => {
        setIsSelected(location.pathname ==="/proveedores" || location.pathname ==="/productos")
    }, [])

  return (
    <NavDropdown title="Proveedores" className={isSelected && "selected" } showArrow>
      <NavBtn type="dropdownItem" href="/proveedores">
        Ver Proveedores
      </NavBtn>
      <NavBtn type="dropdownItem" href="/productos">
        Ver Productos
      </NavBtn>
    </NavDropdown>
  );
};
