import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './MainCaja.css'

import { Toaster } from "react-hot-toast";

import AdministrarCaja from "./administrarCaja/AdministrarCaja";
import CajaMainForm from "./abrirCaja/CajaMainForm";
import CajaStorage from "../../utils/CajaStorage";

const MainCaja = () => {

    const [sesionAbierta, setSesionAbierta] = useState(false);

    useEffect(() => {
        if (CajaStorage.getCajaId() && CajaStorage.getSesionCajaId()) {
            setSesionAbierta(true)
        }
    }, [sesionAbierta])

    return (
        <>
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

            {(sesionAbierta) ?
                (<AdministrarCaja setSesionAbierta={setSesionAbierta} />)
                :
                (<CajaMainForm setSesionAbierta={setSesionAbierta} />)
            }
        </>
    )
}


export default MainCaja
