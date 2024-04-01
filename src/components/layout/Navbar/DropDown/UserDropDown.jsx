import { useEffect, useState } from "react";
import { NavBtn } from "../NavBtn";
import { HiUser } from "react-icons/hi";
import { NavDropdown } from "./NavDropdown";
import { useNavigate } from "react-router-dom";


const UserDropDownTitle = ({ nombre }) => {
  return (
    <>
      <span className="text">{nombre}</span>
      <span
        style={{
          borderRadius: "100%",
          background: "#f4ebff",
          margin: "0.5rem",
        }}
      >
        <HiUser
          style={{
            height: "30px",
            width: "30px",
            margin: "0.3rem",
            borderRadius: "100%",
            color: "gray",
          }}
        />
      </span>
    </>
  );
};

export const UserDropDown = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserData(user);
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <>
      <NavDropdown title={<UserDropDownTitle nombre={userData?.nombre} style={{minWidth:"max-content"}}/>} left>
        <NavBtn type="dropdownItem" href="#">
          Configurar Cuenta
        </NavBtn>
        <NavBtn type="dropdownItem" href="#" onClick={handleLogout} >
          Cerrar Sesión
        </NavBtn>
      </NavDropdown>
    </>
  );
};
