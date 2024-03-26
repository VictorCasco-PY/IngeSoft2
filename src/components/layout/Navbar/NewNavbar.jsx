import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material";
import { AppBarStyle } from "./styles/AppBarStyle";
import { ToolbarStyle } from "./styles/ToolbarStyle";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../../assets/logo.png";
import { NavBtn } from "./NavBtn";
import { ProveedoresDropdown } from "./DropDown/ProveedoresDropdown";
import { UserDropDown } from "./DropDown/UserDropDown";

const NavbarStyled = styled(AppBar)(AppBarStyle);
const ToolbarStyled = styled(Toolbar)(ToolbarStyle);

export const NewNavbar = () => {

  return (
    <NavbarStyled position="static">
      <div className="nav-container">
        <ToolbarStyled>
          <div>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <NavBtn id="nav-logo" type="base">
              <img
                src={Logo}
                alt="Logo de la aplicación"
                className="logo-img"
              />
            </NavBtn>
            <NavBtn id="nav-clientes" href="/clientes">
              Clientes
            </NavBtn>
            <ProveedoresDropdown />
            <NavBtn id="nav-usuarios" href="/users">
              Usuarios
            </NavBtn>
            <NavBtn id="nav-servicios" href="/servicios">
              Servicios
            </NavBtn>
            <NavBtn id="nav-caja" href="/caja">
              Caja
            </NavBtn>
            <NavBtn id="nav-reportes" href="/reportes">
              Reportes
            </NavBtn>
          </div>

          <UserDropDown />
        </ToolbarStyled>
      </div>
    </NavbarStyled>
  );
};
