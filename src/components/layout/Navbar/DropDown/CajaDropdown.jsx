import { useEffect, useState } from "react";
import { NavBtn } from "../NavBtn";
import { NavDropdown } from "./NavDropdown";
import { useLocation } from "react-router-dom";
import RolEnum from "../../../../utils/RolEnum";

export const CajaDropdown = () => {
  const location = useLocation();
  const [isSelected , setIsSelected] = useState(false)

    useEffect(() => {
        setIsSelected(location.pathname ==="/caja" || location.pathname ==="/productos")
    }, [])

  return (
    <NavDropdown title="Caja" className={isSelected && "selected" } roles={[RolEnum.ADMIN, RolEnum.CAJERO]} showArrow>
      <NavBtn type="dropdownItem" href="/caja">
        Caja
      </NavBtn>
      <NavBtn type="dropdownItem" href="/caja/historial" >
        Historial de Movimientos
      </NavBtn>
    </NavDropdown>
  );
};
