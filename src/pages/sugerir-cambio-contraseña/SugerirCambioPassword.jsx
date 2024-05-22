
import "./sugerirCambioPassword.css"
import { useCurrentUser } from "../../context/UserContext"
import RolEnum from "../../utils/RolEnum"
import { useNavigate } from "react-router-dom"
import { usePassword } from "../../hooks/usePassword"
import { useEffect, useState } from "react"
import { Loader } from "../../components/layout/Loader"
import toast, { Toaster } from "react-hot-toast";
import { passRegex } from "../../utils/passRegex"
import { SugerirForm } from "./SugerirForm"


export const SugerirCambioPassword = () => {

    const navigate = useNavigate();
    const { rol } = useCurrentUser();
    const { needChange, changePassword } = usePassword();
    const [stayHere, setStayHere] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [passData, setPassData] = useState({ passActual: "", nuevaPass: "", confirmarPass: "" })

    const handleChangePassword = async () => {

        if (!passRegex.test(passData.nuevaPass)) {
            toast.error("La nueva contraseña debe tener al menos 6 caracteres, al menos una mayúscula, una minúscula, un número y un caracter especial");
            return
        }

        if (passData.nuevaPass !== passData.confirmarPass) {
            toast.error("Las contraseñas no coinciden");
            console.log(passData);
            return
        }

        try {
            await changePassword(passData);
            toast.success("Contraseña cambiada con éxito");
            setRedirect(true)
            setTimeout(() => {
                redirectToMain()
            }, 3000);
        } catch (error) {
            toast.error("Hubo un error al cambiar la contraseña, por favor intente nuevamente.")
        }

    }

    const redirectToMain = () => {

        if (rol == RolEnum.CLIENTE) {
            navigate("/clientes/dashboard");
            return
        }

        navigate("/clientes");
    }

    const stayHereOrRedirect = async () => {
        const stayHere = await needChange();
        if (!stayHere) {
            redirectToMain()
            return;
        }
        setStayHere(true)
    }

    const handleChangeActualPasswordInput = (e) => {
        const value = e.target.value;
        setPassData({ ...passData, passActual: value });
    }

    const handleChangeNuevaPasswordInput = (e) => {
        const value = e.target.value;
        setPassData({ ...passData, nuevaPass: value });
    }

    const handleChangeConfirmPasswordInput = (e) => {
        const value = e.target.value;
        setPassData({ ...passData, confirmarPass: value });
    }

    useEffect(
        () => {
            stayHereOrRedirect()
        }, [])


    const content = () => {

        if (!stayHere)
            return (<div className="suggestion-card bg-white rounded-3 shadow-lg p-5">
                <div className=" justify-content-center align-items-middle d-flex">
                    <Loader />
                </div>
            </div>)

        if (redirect)
            return <>
                <div className="suggestion-card bg-white rounded-3 shadow-lg p-5 d-grid gap-5">
                    <div>
                        <h3 className="text-secondary text-center">Será redirigido automáticamente a su página principal...</h3>
                    </div>
                    <Loader msg="Redirigiendo..." />
                </div>
            </>

        return <SugerirForm
            redirectToMain={redirectToMain}
            handleChangeActualPasswordInput={handleChangeActualPasswordInput}
            handleChangeNuevaPasswordInput={handleChangeNuevaPasswordInput}
            handleChangeConfirmPasswordInput={handleChangeConfirmPasswordInput}
            handleChangePassword={handleChangePassword} />
    }

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
        <div className="suggestion-container mx-auto">
            <div className="p-4 mx-auto">
                {content()}

            </div>

        </div>

    </>
    )
}