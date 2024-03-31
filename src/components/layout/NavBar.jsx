import React, { useEffect, useState, useRef } from "react";
import "./NavBar.css";
import Logo from "../../assets/logo.png";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiArrowDropDownFill } from "react-icons/ri";

const NavBar = () => {
    const [userData, setUserData] = useState(null);
    const [showLogoutOptions, setShowLogoutOptions] = useState(false);
    const [showClientesDropdown, setShowClientesDropdown] = useState(false); //para mostrar/ocultar el Dropdown de clientes
    const [showProveedoresDropdown, setShowProveedoresDropdown] = useState(false); // el Dropdown de proveedores
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownClientesRef = useRef(null);
    const dropdownProveedoresRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserData(user);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate("/");
    };

    const toggleLogoutOptions = () => {
        setShowLogoutOptions(!showLogoutOptions);
    };

    const toggleClientesDropdown = () => {
        setShowClientesDropdown(!showClientesDropdown);
        setShowProveedoresDropdown(false); // Cierra el dropdown de proveedores al abrir el de clientes
    };

    const toggleProveedoresDropdown = () => {
        setShowProveedoresDropdown(!showProveedoresDropdown);
        setShowClientesDropdown(false); // Cierra el dropdown de clientes al abrir el de proveedores
    };

    const isActiveLink = (link) => {
        return location.pathname.startsWith(link);
    };

    const closeDropdowns = () => {
        setShowClientesDropdown(false);
        setShowProveedoresDropdown(false);
    };

    const handleClickOutside = (event) => {
        if (
            dropdownClientesRef.current &&
            !dropdownClientesRef.current.contains(event.target) &&
            dropdownProveedoresRef.current &&
            !dropdownProveedoresRef.current.contains(event.target)
        ) {
            closeDropdowns();
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="logo-btn" onClick={closeDropdowns}><img src={Logo} alt="Logo de la aplicación" className="logo-img" /></button>
                <div ref={dropdownClientesRef} className=".dropdown">
                    <button onClick={toggleClientesDropdown} className={`nav-btn ${showClientesDropdown ? 'active' : ''}`}>Clientes <RiArrowDropDownFill /></button>
                    <div className={`dropdown-content ${showClientesDropdown ? 'show' : ''}`}>
                        <Link to="/clientes" className={`nav-link ${isActiveLink("/clientes") ? 'active' : ''}`} onClick={closeDropdowns}>Lista de clientes</Link>
                    </div>
                </div>
                <div ref={dropdownProveedoresRef} className=".dropdown">
                    <button onClick={toggleProveedoresDropdown} className={`nav-btn ${showProveedoresDropdown ? 'active' : ''}`}>Proveedores <RiArrowDropDownFill /></button>
                    <div className={`dropdown-content ${showProveedoresDropdown ? 'show' : ''}`}>
                        <Link to="/proveedores" className={`nav-link ${isActiveLink("/proveedores") ? 'active' : ''}`} onClick={closeDropdowns}>Lista de proveedores</Link>
                        <Link to="/productos" className={`nav-link ${isActiveLink("/productos") ? 'active' : ''}`} onClick={closeDropdowns}>Lista de productos</Link>
                    </div>
                </div>
                <Link to="/users" ><button className={`nav-btn ${isActiveLink("/users") ? 'active' : ''}`}>Usuarios</button></Link> 
                <Link to="/servicios" ><button className={`nav-btn ${isActiveLink("/servicios") ? 'active' : ''}`}>Servicios</button></Link>    
                <Link to="/caja" ><button className={`nav-btn ${isActiveLink("/caja") ? 'active' : ''}`}>Caja</button></Link>
                <Link to="/reportes" ><button className={`nav-btn ${isActiveLink("/reportes") ? 'active' : ''}`}>Reportes</button></Link>


                <Link to="/comprasCaja" ><button className={`nav-btn ${isActiveLink("/comprasCaja") ? 'active' : ''}`}>Compras Caja</button></Link> 

                <Link to="/ListaComprasCaja" ><button className={`nav-btn ${isActiveLink("/ListaComprasCaja") ? 'active' : ''}`}>Lista Compras Caja</button></Link> 

            </div>
            <div className="navbar-right">
                {userData && (
                    <div className="usuario-container">
                        <span className="usuario">{userData.nombre}</span>
                        <div className="icono-usuario-container">
                            <button className="icono-usuario" onClick={toggleLogoutOptions}>
                                <span>{userData.nombre.charAt(0)}</span>
                            </button>
                            {showLogoutOptions && (
                                <div className="logout-options">
                                    <button onClick={handleLogout}>Cerrar sesión</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
