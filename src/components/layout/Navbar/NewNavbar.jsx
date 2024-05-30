import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material";
import { AppBarStyle } from "./styles/AppBarStyle";
import { ToolbarStyle } from "./styles/ToolbarStyle";
import { BoxStyle } from "./styles/BoxStyle";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../../assets/nav-logo.png";
import { NavBtn } from "./NavBtn";
import { ProveedoresDropdown } from "./DropDown/ProveedoresDropdown";
import { ReporteDropdown } from "./DropDown/ReporteDropdown"
import { UserDropDown } from "./DropDown/UserDropDown";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import RolEnum from "../../../utils/RolEnum";
import "../Layout.css";

const NavbarStyled = styled(AppBar)(AppBarStyle);
const ToolbarStyled = styled(Toolbar)(ToolbarStyle);
const BoxStyled = styled(Box)(BoxStyle);

export const NewNavbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <NavbarStyled position="static">
      <div className="nav-container">
        <ToolbarStyled>
          {/* Aca va el el burguer */}
          <div
            onMouseOver={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <NavBtn
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              className="d-inline-block d-lg-none px-4"
            >
              <MenuIcon />
            </NavBtn>

            <NavBtn id="nav-logo" className="d-lg-inline-flex" type="base">
              <img src={Logo} alt="Logo de la aplicación" />
            </NavBtn>

            {/* Aca va el menu*/}
            <BoxStyled
              className={`${
                (!showMenu && "d-none") || "d-block"
              } d-lg-inline-block position-absolute position-lg-relative bg-white`}
            >
              <NavBtn
                id="nav-dashboard"
                href="/dashboard"
                roles={[RolEnum.ADMIN]}
              >
                Dashboard
              </NavBtn>
              <NavBtn
                id="nav-clientes"
                href="/clientes"
                roles={[RolEnum.ADMIN, RolEnum.ENTRENADOR, RolEnum.CAJERO]}
              >
                Clientes
              </NavBtn>
              <NavBtn id="botonextra" roles={[RolEnum.ADMIN, RolEnum.CAJERO]}>
                <ProveedoresDropdown />
              </NavBtn>
              <NavBtn id="nav-usuarios" href="/users" roles={[RolEnum.ADMIN]}>
                Usuarios
              </NavBtn>
              <NavBtn
                id="nav-servicios"
                href="/servicios"
                roles={[RolEnum.ADMIN, RolEnum.ENTRENADOR]}
              >
                Servicios
              </NavBtn>
              <NavBtn
                id="nav-caja"
                href="/caja"
                roles={[RolEnum.ADMIN, RolEnum.CAJERO]}
              >
                Caja
              </NavBtn>
              <NavBtn id="botonextra" roles={[RolEnum.ADMIN]}>
                <ReporteDropdown />
              </NavBtn>
              <NavBtn
                id="nav-planes"
                href="/planes-entrenamiento"
                roles={[RolEnum.ADMIN, RolEnum.ENTRENADOR]}
              >
                Planes
              </NavBtn>
              <NavBtn
                id="nav-dashboard-entrenador"
                href="/entrenador/dashbo"
                roles={[RolEnum.ENTRENADOR]}
              >
                Dashboard Entrenador
              </NavBtn>
              {/* Navbar para clientes */}
              <NavBtn
                id="nav-dashboard-cliente"
                href="/clientes/dashboard"
                roles={[RolEnum.CLIENTE]}
              >
                Dashboard cliente
              </NavBtn>

              <NavBtn
                id="nav-actividades-cliente"
                href="/clientes/actividades"
                roles={[RolEnum.CLIENTE]}
              >
                Actividades
              </NavBtn>
            </BoxStyled>
          </div>

          <UserDropDown />
        </ToolbarStyled>
      </div>
    </NavbarStyled>
  );
};
