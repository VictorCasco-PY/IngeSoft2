import React, { createContext, useContext, useEffect, useState } from "react";
import UserStorage from "../utils/UserStorage";

const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {

    const [token, setToken] = useState(null);
    const [rol, setRol] = useState(null);
    const [email, setEmail] = useState(null);
    const [nombre, setNombre] = useState(null);
    const [userId, setUserId] = useState(null);

    const login = (user) => {
        const data = {
            accessToken: user.accessToken,
            rol: user.rol,
            email: user.email,
            nombre: user.nombre,
            usuarioId: user.usuarioId,
        };
        UserStorage.setUser(data);
    };

    const logout = () => {
        UserStorage.removeUser();
        setToken(null);
        setRol(null);
        setEmail(null);
        setNombre(null);
        setUserId(null);
    };

    const setLocalStorage = () => {
        const data = UserStorage.getUser();
        if (data) {
            setToken(data.accessToken);
            setRol(data.rol);
            setEmail(data.email);
            setNombre(data.nombre);
            setUserId(data.usuarioId);
        }
    }

    useEffect(() => {
        setLocalStorage()
    }, []);

    return (
        <CurrentUserContext.Provider value={{ token, nombre, email, rol, userId, logout, login, }}>
            {children}
        </CurrentUserContext.Provider>
    );
};

export const useCurrentUser = () => useContext(CurrentUserContext);

export default CurrentUserProvider;