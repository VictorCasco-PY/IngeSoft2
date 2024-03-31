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

            {sesionAbierta ? (
                <AdministrarCaja setSesionAbierta={setSesionAbierta} />
            ) : (
                /*como useEffect se ejecuta antes del renderizado, utilizo este workaround para evitar
                    volver a renderizar, si se conoce una mejor solucion, decir a andy*/
                (!(CajaStorage.getCajaId() && CajaStorage.getSesionCajaId())) && (
                    <CajaMainForm setSesionAbierta={setSesionAbierta} />
                )
            )}
        </>
    )
}


export default MainCaja
