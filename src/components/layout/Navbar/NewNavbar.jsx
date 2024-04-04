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
import { UserDropDown } from "./DropDown/UserDropDown";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../../context/UserContext";
import NavBarAdmin from "./roles/NavBarAdmin";
import RolEnum from "../../../utils/RolEnum";

const NavbarStyled = styled(AppBar)(AppBarStyle);
const ToolbarStyled = styled(Toolbar)(ToolbarStyle);
const BoxStyled = styled(Box)(BoxStyle);

export const NewNavbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { rol } = useCurrentUser();

  //cambio de andy, tuve que tocar, pueden agregar navbars especificos a roles.
  const switchRender = () => {
    if ((rol === "ADMIN") || (rol === RolEnum.ADMIN)) { //si es admin.
      return <NavBarAdmin />
    } else { //aqui pueden agregar navbars especificos a roles
      return <NavBarAdmin />
    }
  }

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

            <NavBtn
              id="nav-logo"
              className="d-lg-inline-flex"
              type="base"
            >
              <img src={Logo} alt="Logo de la aplicación" />
            </NavBtn>

            {/* Aca va el menu*/}
            <BoxStyled
              className={`${!showMenu && "d-none" || "d-block"
                } d-lg-inline-block position-absolute position-lg-relative bg-white`}
            >
              {switchRender()}
            </BoxStyled>
          </div>

          <UserDropDown />
        </ToolbarStyled>
      </div>
    </NavbarStyled>
  );
};
