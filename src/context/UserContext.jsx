import React, { createContext, useContext, useEffect, useState } from "react";

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

        localStorage.setItem("user", JSON.stringify(data));
    };

    const logout = () => {
        localStorage.removeItem("user");
    };

    const setLocalStorage = () => {
        const storedToken = localStorage.getItem("user");
        if (storedToken) {
            const data = JSON.parse(storedToken);
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