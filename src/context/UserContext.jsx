import React, { createContext, useContext, useEffect, useState } from "react";
import UserStorage from "../utils/UserStorage";
import { useNavigate } from "react-router-dom";
import CajaStorage from "../utils/CajaStorage";
import { toast } from 'react-hot-toast';

const CurrentUserContext = createContext();


export const CurrentUserProvider = ({ children }) => {

    const [token, setToken] = useState(null);
    const [rol, setRol] = useState(null);
    const [email, setEmail] = useState(null);
    const [nombre, setNombre] = useState(null);
    const [userId, setUserId] = useState(null);
    //TODO: usar useReducer para manejar el estado de autenticación, porque useState no es lo más adecuado para este caso
    const [isAuthenticated, setIsAuthenticated] = useState();

    const navigate = useNavigate();

    const login = (user) => {
        const data = {
            accessToken: user.accessToken,
            rol: user.rol,
            email: user.email,
            nombre: user.nombre,
            usuarioId: user.usuarioId,
        };
        UserStorage.setUser(data);
        setIsAuthenticated(true);
    };

    const logout =  () => {
        //si hay una sesion de caja abierta, cerrarla
        //TODO: que sea un popup advirtiendo que hay una caja abierta y opcion de cerrar o cancelar.
        const isCajaAbierta = CajaStorage.getCajaId() || CajaStorage.getSesionCajaId();
        if (isCajaAbierta) {
            CajaStorage.cerrarCaja();
            toast.success("Se cerró la sesión de caja abierta..")
        }
        
        UserStorage.removeUser();
        setToken(null);
        setRol(null);
        setEmail(null);
        setNombre(null);
        setUserId(null);
        setIsAuthenticated(false);
        if (isCajaAbierta) {
            setTimeout(() => {navigate("/");}, 1000);
        } else {
            navigate("/");
        }
    };

    const setLocalStorage = () => {
        const data = UserStorage.getUser();
        if (data) {
            setToken(data.accessToken);
            setRol(data.rol);
            setEmail(data.email);
            setNombre(data.nombre);
            setUserId(data.usuarioId);
            setIsAuthenticated(true);
        }
    }

    useEffect(() => {
        setLocalStorage()
    }, [isAuthenticated]);

    return (
        <CurrentUserContext.Provider value={{ token, nombre, email, rol, userId, logout, login, }}>
            {children}
        </CurrentUserContext.Provider>
    );
};

export const useCurrentUser = () => useContext(CurrentUserContext);

export default CurrentUserProvider;