import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Btn } from "../../../components/bottons/Button";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";
import { useNavigate } from "react-router-dom";

import './AdministrarCaja.css'


import toast, { Toaster } from "react-hot-toast";

import useSesionCaja from "../../../hooks/useSesionCaja";
import useCaja from "../../../hooks/useCaja";

import CajaStorage from "../../../utils/CajaStorage";
import { CircularProgress } from "@mui/material";
import UserStorage from "../../../utils/UserStorage";

const AdministrarCaja = ({ setSesionAbierta }) => {

    const navigate = useNavigate();
    const { getCajaById, data: req_caja, isLoading: cargandoCaja, error: errorCajas } = useCaja();
    const { getSesionCajaById, cerrarCajaById, data: req_sesion, isLoading: cargandoSesion, error: errorSesion } = useSesionCaja();
    const [sesionCaja, setSesionCaja] = useState({});
    const [caja, setCaja] = useState({});
    const [user, setUser] = useState({});

    const [disabledCerrarCaja, setDisabledCerrarCaja] = useState(false);

    const fetchData = async () => {
        const data1 = await getCajaById(CajaStorage.getCajaId());
        const data2 = await getSesionCajaById(CajaStorage.getSesionCajaId());
        setCaja(data1);
        setSesionCaja(data2);
    }

    useEffect(() => {
        if (CajaStorage.getCajaId() && CajaStorage.getSesionCajaId()) {
            fetchData();
        } else {
            toast.error("No se ha abierto una caja. No deberías de estar viendo esto...");
            setTimeout(() => {
                setSesionAbierta(false)
            }, 2500);
        }
        if (UserStorage.getUser()) {
            setUser(UserStorage.getUser());
        }
    }, [])


    const goToNuevaCompra = () => {
        if (disabledCerrarCaja) return;
        navigate("/caja-compra");
    }

    const goToListarCompras = () => {
        if (disabledCerrarCaja) return;
        navigate("/lista-compras");
    }

    const goToNuevaVenta = () => {
        if (disabledCerrarCaja) return;
        navigate("/caja-ventas");
    }

    const goToListarVentas = () => {
        if (disabledCerrarCaja) return;
        navigate("/lista-ventas");
    }

    const goToListarCobros = () => {
        if (disabledCerrarCaja) return;
        navigate("/caja/pendientes");
    }

    //AUN NO SE ACTUALIZA EL MONTO FINAL!!!! URGENTE
    const cerrarCajaActual = async () => {
        setDisabledCerrarCaja(true);
        //hora-min-seg
        const hora = new Date().toISOString().slice(11, 19);

        const putData = {
            horaCierre: hora
        }

        const response = await cerrarCajaById(CajaStorage.getSesionCajaId(), putData);

        if (!response) {
            toast.error("Error al cerrar caja. Revise la conexión.");
            setDisabledCerrarCaja(false);
            return;
        }
        setSesionCaja(response);

        CajaStorage.cerrarCaja();
        toast.success(`Caja cerrada con éxito a las ${hora}. Redirigiendo a la página principal..`);
        setTimeout(() => {
            setSesionAbierta(false)
        }, 2500);
    }

    const formatFecha = (fecha) => {
        const fechaArr = fecha.split("-");
        return `${fechaArr[2]}-${fechaArr[1]}-${fechaArr[0]}`;
    }

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

            <CartaPrincipal>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center justify-content-center gap-3 flex-column">
                        {(cargandoCaja && cargandoSesion && caja) ?
                            (<CircularProgress />)
                            :
                            (<h1>{caja.nombre}</h1>)}
                    </div>

                    <div className="d-flex align-items-center justify-content-center gap-3">
                        {sesionCaja.horaCierre ? <p className="p-0 m-0 cajaMiscFont">Caja cerrada a las {sesionCaja.horaCierre}</p> : <p className="p-0 m-0 cajaMiscFont">Caja en curso</p>}
                        <Btn outline onClick={cerrarCajaActual} disabled={disabledCerrarCaja}>
                            Cerrar Caja
                        </Btn>
                    </div>
                </div>

                <div>
                    {(user && user.nombre) &&
                        <>
                            <p className="p-0 m-0 cajaMiscFont">Cajero: {user.nombre}</p>
                            {(sesionCaja && sesionCaja.horaApertura && sesionCaja.fecha) &&
                                <>
                                    <p className="p-0 m-0 cajaMiscFont">Hora de Apertura: {sesionCaja.horaApertura}</p>
                                    <p className="p-0 m-0 cajaMiscFont">Fecha: {formatFecha(sesionCaja.fecha)}</p>
                                </>}
                        </>
                    }
                </div>

                <div className="d-flex gap-5 justify-content-center mt-5 flex-md-row flex-sm-column align-items-center">
                    <div className="card cajaCard">
                        <p className="cajaFont">Ventas</p>

                        <Btn type="primary" onClick={goToNuevaVenta} disabled={disabledCerrarCaja}>
                            Nueva Venta
                        </Btn>

                        <Btn outline onClick={goToListarVentas} disabled={disabledCerrarCaja}>
                            Listar Ventas
                        </Btn>
                    </div>
                    <div className="card cajaCard">
                        <p className="cajaFont">Compras</p>

                        <Btn type="primary" onClick={goToNuevaCompra} disabled={disabledCerrarCaja}>
                            Nueva Compra
                        </Btn>

                        <Btn outline onClick={goToListarCompras} disabled={disabledCerrarCaja}>
                            Listar Compras
                        </Btn>
                    </div>
                    <div className="card cajaCard">
                        <p className="cajaFont">Cobros Pendientes</p>

                        <Btn outline onClick={goToListarCobros} disabled={disabledCerrarCaja}>
                            Listar Cobros Pendientes
                        </Btn>
                    </div>
                </div>

            </CartaPrincipal>
        </>
    )
}


export default AdministrarCaja
