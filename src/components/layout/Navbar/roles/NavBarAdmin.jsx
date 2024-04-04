import React from 'react';
import { NavBtn } from '../NavBtn';
import { ProveedoresDropdown } from '../DropDown/ProveedoresDropdown';

const NavBarAdmin = () => {
    return (
        <>
            <NavBtn id="nav-dashboard" href="/dashboard">
                Dashboard
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
        </>
    );
}

export default NavBarAdmin;