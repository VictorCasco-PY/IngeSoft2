import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "./api";
import { useCurrentUser } from "../context/UserContext";
import toast, { Toaster } from "react-hot-toast";
export const VerifyToken = () => {

    const [valid, setValid] = useState(true);

    const navigate = useNavigate();
    const { token, logout } = useCurrentUser();

    const location = useLocation();

    const tokenExpired = () => {
        if (valid) {
            toast.error("Su sesión ha expirado, por favor inicie sesión nuevamente.")
        }
        removeTokenAndGoToLogin()
    }

    const removeTokenAndGoToLogin = () => {
        logout();
        navigate("/");
        setValid(false);
    }


    useEffect(() => {
        if (location === "/") {
            return;
        }
        const verifyToken = async () => {
            try {
                // Ya el token se envía en la cabecera de la petición, no es necesario enviarlo en el body
                const res = await api.get("/auth/verify");
                console.log(res)
                console.lo("AAAAAAAAAAAAAAAAAA")
                if (res.data === "true") {
                    return;
                }
            } catch (error) {
                if (error?.response?.status === 403 || error?.response?.status === 401) {
                    tokenExpired();
                }
            }
        }

        verifyToken();
    }, []);

    return (<>
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                success: {
                    style: {
                        background: "#75B798",
                        color: "#0A3622",
                    },
                },
                error: {
                    style: {
                        background: "#FFDBD9",
                        color: "#D92D20",
                    },
                },
            }}
        />

    </>)

}