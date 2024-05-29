import { useEffect, useState } from "react";
import { NavBtn } from "../NavBtn";
import { NavDropdown } from "./NavDropdown";
import { useLocation } from "react-router-dom";

export const ReporteDropdown = () => {
  const location = useLocation();
  const [isSelected , setIsSelected] = useState(false)

    useEffect(() => {
        setIsSelected(location.pathname ==="/reportes" || location.pathname ==="/reportes-ventas")
    }, [])

  return (
    <NavDropdown title="Reportes" className={isSelected && "selected" } showArrow>
      <NavBtn type="dropdownItem" href="/reportes" >
        Reporte Clientes
      </NavBtn>
      <NavBtn type="dropdownItem" href="/reportes-ventas">
       Reporte Ventas
      </NavBtn>
    </NavDropdown>
  );
};