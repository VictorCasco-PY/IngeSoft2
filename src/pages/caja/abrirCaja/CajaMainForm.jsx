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

import Select from 'react-select/async';
import Pagination from "../../../components/pagination/PaginationContainer";

const CajaMainForm = ({ setSesionAbierta }) => {

    const [openRegistrarModal, setOpenRegistrarModal] = useState(false);

    const { getAllCajas, data: req_cajas, isLoading: cargandoCajas, error: errorCajas } = useCaja();
    const { createSesionCaja, data: req_sesion, isLoading: cargandoSesion, error: errorSesion } = useSesionCaja();

    const [abrirDisabled, setAbrirDisabled] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [cajas, setCajas] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    //const [selectedValue, setSelectedValue] = useState(null);

    const fetchCajas = async () => {
        if (currentPage > totalPages) {
            setTotalPages(1);
        }
        const res = await getAllCajas(currentPage);
        setTotalPages(res.totalPages);
        setCajas(res.items);
    }

    useEffect(() => {
        //si ya se abrio una caja, ir a administración
        if (!(CajaStorage.getCajaId() && CajaStorage.getSesionCajaId())) {
            if (UserStorage.getUser()) {
                fetchCajas()
                setAbrirDisabled(false)
                if (errorCajas) {
                    setAbrirDisabled(true);
                    toast.error("Error al cargar cajas. Revise la conexión.");
                }
            } else {
                toast.error("No has iniciado sesión...")
            }
        } else {
            toast.error("Ya tienes una caja abierta, no deberías de estar viendo esto...")
        }
    }, [currentPage])

    const handleAbrirCaja = async (values) => {

        if (cargandoSesion || cargandoCajas) return;
        const date = new Date();
        //anho-mes-fecha
        const fecha = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' : '') + date.getDate();
        //hora-min-seg
        //agregar un cero si es menor a 10
        const hora = date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ":" + date.getSeconds();

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

        } else if (errorSesion && errorSesion.response && errorSesion.response.status === 400) {
            toast.error("El monto especificado no coincide con el monto inicial de la caja seleccionada.")
        }
        else {
            toast.error("Error al abrir caja. Revise la conexión.");
        }
    }

    return (
        <>
            <ModalRegistrarCaja open={openRegistrarModal} closeModal={() => { setOpenRegistrarModal(false) }} toast={toast} fetchFunction={fetchCajas} />

            <CartaPrincipal>
                {/**/}
                {/*{req_cajas.items && (
                    <Select />
                )}*/}
                {/**/}

                <Btn type="primary" className='mt-3 align-self-end' loading={cargandoSesion} disabled={(cargandoSesion)} icon={<IoAdd />}
                    onClick={() => { setOpenRegistrarModal(true) }}>
                    Registrar Nueva Caja
                </Btn>
                <div className="d-flex align-items-center justify-content-center my-auto">
                    <div className="d-flex flex-column p-4 py-5 card " style={{ "width": "30rem", marginLeft: 0 }}>
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
                            <Form className="d-flex flex-column gap-2" style={{minHeight: 364 }}>
                                <h1>Abrir caja</h1>
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
                                            {/*<div className="align-self-start">
                                                    <button onClick={() => {
                                                        setCurrentPage(currentPage + 1);
                                                    }} disabled={currentPage >= totalPages} className="mt-2">Siguiente Página</button>
                                                </div> */}
                                            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}></Pagination>

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

                                <Btn type="primary" className='mt-3 align-self-end mt-auto' loading={cargandoSesion} disabled={((cargandoSesion || cargandoCajas || abrirDisabled))}
                                    submit >
                                    Abrir Caja
                                </Btn>

                                {/*<nav>
                                        {errorSesion && <p className="text-danger">Error al abrir caja. Revise la conexión.</p>}
                                    </nav>*/}
                            </Form>
                        </Formik>
                    </div>
                </div>

            </CartaPrincipal>
        </>
    );
}

export default CajaMainForm;
