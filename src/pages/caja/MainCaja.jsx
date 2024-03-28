import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Btn } from "../../components/bottons/Button";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";
import './MainCaja.css'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormSelect, FormTextInput } from "../../components/forms/FormInputs";
import { useNavigate } from "react-router-dom";

import useCaja from "../../hooks/useCaja";
import useSesionCaja from "../../hooks/useSesionCaja";

import toast, { Toaster } from "react-hot-toast";

import CircularProgress from "@mui/material/CircularProgress";
import CajaStorage from "../../utils/CajaStorage";
import { IoAdd } from "react-icons/io5";
import ModalBase from "../../components/modals/ModalBase";
import ModalRegistrarCaja from "./ModalRegistrarCaja";
import UserStorage from "../../utils/UserStorage";

const MainCaja = () => {

    const { getAllCajas, data: req_cajas, isLoading: cargandoCajas, error: errorCajas } = useCaja();
    const { createSesionCaja, data: req_sesion, isLoading: cargandoSesion, error: errorSesion } = useSesionCaja();

    const [abrirDisabled, setAbrirDisabled] = useState(true);
    const [openRegistrarModal, setOpenRegistrarModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        //si ya se abrio una caja, ir a administración
        if (CajaStorage.getCajaId() && CajaStorage.getSesionCajaId()) {
            navigate(`/caja-administracion`);
        } else {
            if (UserStorage.getUser()) {
                getAllCajas(1);
                setAbrirDisabled(false)
                if (errorCajas) {
                    setAbrirDisabled(true);
                    toast.error("Error al cargar cajas. Revise la conexión.");
                }
            } else {
                toast.error("No has iniciado sesión...")
            }
        }
    }, [localStorage.getItem("user")])

    const handleAbrirCaja = async (values) => {

        if (cargandoSesion || cargandoCajas) return;

        //anho-mes-fecha
        const fecha = new Date().toISOString().slice(0, 10);
        //hora-min-seg
        const hora = new Date().toISOString().slice(11, 19);

        const postData = {
            idCaja: values['id_caja'],
            idUsuario: UserStorage.getEmpleadoId(),
            montoInicial: values['montoInicial'],
            montoFinal: null,
            fecha: fecha,
            horaApertura: hora,
            horaCierre: null
        }

        const success = await createSesionCaja(postData);

        if (!errorSesion && success) {

            CajaStorage.setCajaId(success['idCaja']);
            CajaStorage.setSesionCajaId(success['id']);

            navigate(`/caja-administracion`);
        } else {
            toast.error("Error al abrir caja. Revise la conexión.");
        }
    }

    // por el momento utilizo esto para evitar cargar contenido en la pagina si una caja esta abierta
    // si existe una mejor solucion, avisar a andy
    // de todas formas en el useEffect se redirecciona a administracion-caja si hay una caja abierta
    if (CajaStorage.getCajaId() && CajaStorage.getSesionCajaId()) {
        return (
            <>
            </>
        )
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

            <ModalRegistrarCaja open={openRegistrarModal} closeModal={() => {setOpenRegistrarModal(false)}} toast={toast}/>

            <CartaPrincipal>
                <Btn type="primary" className='mt-3 align-self-end' loading={cargandoSesion} disabled={((cargandoSesion || abrirDisabled))} icon={<IoAdd />}
                onClick={() => {setOpenRegistrarModal(true)}}>
                    Registrar Nueva Caja
                </Btn>
                <div className="d-flex align-items-center justify-content-center my-auto">
                    <div className="d-flex flex-column p-4 py-5 card" style={{ "width": "30rem", marginLeft: 0 }}>
                        <h1>Abrir caja</h1>
                        <Formik
                            initialValues={{
                                id_caja: '',
                                montoInicial: ''
                            }}
                            validationSchema={Yup.object({
                                id_caja: Yup.string()
                                    .required('Requerido'),
                                montoInicial: Yup.number()
                                    .typeError('El monto debe ser un numero')
                                    .required('Requerido')
                                    .positive('Debe ser un número positivo')
                                ,
                            })}
                            onSubmit={async (values) => {
                                handleAbrirCaja(values)
                            }}
                        >
                            <Form>
                                <div className="d-flex flex-column gap-2">
                                    {cargandoCajas ? (
                                        <div className="d-flex flex-column align-items-center justify-content-center mt-2">
                                            <CircularProgress />
                                            <p className="pt-2">Cargando cajas...</p>
                                        </div>
                                    ) : (
                                        req_cajas.items ? (
                                            <>
                                                <FormSelect
                                                    label="Caja"
                                                    name="id_caja"
                                                    required={true}
                                                >
                                                    <option value="">Selecciona una Caja</option>
                                                    {req_cajas.items.map(caja => (
                                                        <option key={caja.id} value={caja.id}>{caja.nombre}</option>
                                                    ))}
                                                </FormSelect>
                                                <FormTextInput
                                                    label="Monto Inicial en Efectivo"
                                                    name="montoInicial"
                                                    type="number"
                                                    placeholder="2000000"
                                                    required={true}
                                                />
                                            </>
                                        ) : (
                                            <p className="pt-2">No se encontraron cajas, registra una nueva caja.</p>
                                        )
                                    )}

                                    <Btn type="primary" className='mt-3 align-self-end' loading={cargandoSesion} disabled={((cargandoSesion || cargandoCajas || abrirDisabled))}
                                        submit >
                                        Abrir Caja
                                    </Btn>

                                    {/*<nav>
                                        {errorSesion && <p className="text-danger">Error al abrir caja. Revise la conexión.</p>}
                                    </nav>*/}

                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>

            </CartaPrincipal>
        </>
    )
}


export default MainCaja
