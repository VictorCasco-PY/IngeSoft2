import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Btn } from "../../../components/bottons/Button";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";
import '../MainCaja.css'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormSelect, FormTextInput } from "../../../components/forms/FormInputs";

import useCaja from "../../../hooks/useCaja";
import useSesionCaja from "../../../hooks/useSesionCaja";

import toast from "react-hot-toast";

import CircularProgress from "@mui/material/CircularProgress";
import { IoAdd } from "react-icons/io5";

import ModalRegistrarCaja from "./ModalRegistrarCaja";

import UserStorage from "../../../utils/UserStorage";
import CajaStorage from "../../../utils/CajaStorage";

import AsyncSelect from 'react-select/async';

const CajaMainForm = ({ setSesionAbierta }) => {

    const [openRegistrarModal, setOpenRegistrarModal] = useState(false);

    const { getAllCajas, data: req_cajas, isLoading: cargandoCajas, error: errorCajas } = useCaja();
    const { createSesionCaja, data: req_sesion, isLoading: cargandoSesion, error: errorSesion } = useSesionCaja();

    const [abrirDisabled, setAbrirDisabled] = useState(true);
    //const [selectedValue, setSelectedValue] = useState(null);

    useEffect(() => {
        //si ya se abrio una caja, ir a administración
        if (!(CajaStorage.getCajaId() && CajaStorage.getSesionCajaId())) {
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
    }, [])

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
            setSesionAbierta(true);

        } else {
            toast.error("Error al abrir caja. Revise la conexión.");
        }
    }


    return (
        <>
            <ModalRegistrarCaja open={openRegistrarModal} closeModal={() => { setOpenRegistrarModal(false) }} toast={toast} />

            <CartaPrincipal>
                {/**/}
                {/**/}
                {req_cajas.items && (
                    <AsyncSelect
                        cacheOptions
                        loadOptions={getAllCajas}
                        onInputChange={(data) => {
                            console.log(data);
                        }}
                        onChange={(data) => {
                            console.log(data);
                        }}
                        defaultOptions
                    />
                )}

                <Btn type="primary" className='mt-3 align-self-end' loading={cargandoSesion} disabled={(cargandoSesion)} icon={<IoAdd />}
                    onClick={() => { setOpenRegistrarModal(true) }}>
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
    );
}

export default CajaMainForm;
