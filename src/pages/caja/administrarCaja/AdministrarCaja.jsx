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

    useEffect(() => {
        if (CajaStorage.getCajaId() && CajaStorage.getSesionCajaId()) {
            getCajaById(CajaStorage.getCajaId());
            setCaja(req_caja);
            getSesionCajaById(CajaStorage.getSesionCajaId());
            setSesionCaja(req_sesion);
        }
        if (UserStorage.getUser()) {
            setUser(UserStorage.getUser());
        }
    }, [caja])


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

        setSesionCaja(await cerrarCajaById(CajaStorage.getSesionCajaId(), putData));

        if (errorSesion) {
            toast.error("Error al cerrar caja. Revise la conexión.");
            setDisabledCerrarCaja(false);
            return;
        }

        CajaStorage.cerrarCaja();
        toast.success(`Caja cerrada con éxito a las ${hora}. Redirigiendo a la página principal..`);
        setTimeout(() => {
            setSesionAbierta(false)
        }, 2500);
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
                        <div>
                            {(user && user.nombre) &&
                                <>
                                    <p className="p-0 m-0">Cajero: {user.nombre}</p>
                                    {(sesionCaja && sesionCaja.horaApertura) && <p className="p-0 m-0">Hora de Apertura: {sesionCaja.horaApertura}</p>}
                                </>
                            }
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-center gap-3">
                        {sesionCaja.horaCierre ? <p className="p-0 m-0">Caja cerrada a las {sesionCaja.horaCierre}</p> : <p className="p-0 m-0">Caja en curso</p>}
                        <Btn outline onClick={cerrarCajaActual} disabled={disabledCerrarCaja}>
                            Cerrar Caja
                        </Btn>
                    </div>
                </div>

                <div className="d-flex gap-5 justify-content-center my-auto flex-md-row flex-sm-column align-items-center">
                    <div className="card cajaCard">
                        <p>Ventas</p>

                        <Btn type="primary" onClick={goToNuevaVenta} disabled={disabledCerrarCaja}>
                            Nueva Venta
                        </Btn>

                        <Btn outline onClick={goToListarVentas} disabled={disabledCerrarCaja}>
                            Listar Ventas
                        </Btn>
                    </div>
                    <div className="card cajaCard">
                        <p>Compras</p>

                        <Btn type="primary" onClick={goToNuevaCompra} disabled={disabledCerrarCaja}>
                            Nueva Compra
                        </Btn>

                        <Btn outline onClick={goToListarCompras} disabled={disabledCerrarCaja}>
                            Listar Compras
                        </Btn>
                    </div>
                    <div className="card cajaCard">
                        <p>Cobros Pendientes</p>

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
