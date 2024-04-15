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
import { useCurrentUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import ListIcon from '@mui/icons-material/List';
import RolEnum from "../../../utils/RolEnum";

const CajaMainForm = ({ setSesionAbierta }) => {

    const [openRegistrarModal, setOpenRegistrarModal] = useState(false);

    const { getAllCajas, data: req_cajas, isLoading: cargandoCajas, error: errorCajas } = useCaja();
    const { createSesionCaja, isLoading: cargandoSesion, error400: errorMonto } = useSesionCaja();

    const [abrirDisabled, setAbrirDisabled] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [cajas, setCajas] = useState([]); //todo: arreglar hook
    const [totalPages, setTotalPages] = useState(1);
    //const [selectedValue, setSelectedValue] = useState(null); //todo: react-select
    const { rol } = useCurrentUser();

    const navigate = useNavigate();

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
        if (!CajaStorage.getSesionCajaId()) { //si no hay caja abierta
            fetchCajas()
            setAbrirDisabled(false)
            if (errorCajas) {
                setAbrirDisabled(true);
                toast.error("Error al cargar cajas. Revise la conexión.");
            }
        } else {
            toast.error("Ya tienes una caja abierta, no deberías de estar viendo esto...")
        }
    }, [currentPage])

    const fetchAbrirSesion = async (data) => {
        return await createSesionCaja(data);
    }

    const handleAbrirCaja = async (values) => {

        if (cargandoSesion || cargandoCajas) return;
        const date = new Date();
        //anho-mes-fecha
        const fecha = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' : '') + date.getDate(); //todo: la fecha ya se formatea en el back, no importa formatear exactamente
        //hora-min-seg
        //agregar un cero si es menor a 10
        const hora = date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ":" + date.getSeconds(); //todo: la fecha ya se formatea en el back, no importa formatear exactamente

        const postData = {
            idCaja: values['id_caja'],
            idUsuario: UserStorage.getEmpleadoId(),
            fecha: fecha,
            horaApertura: hora,
        }

        const success = await fetchAbrirSesion(postData);

        //todo: transformar a buena practica, que el error se chequee primero
        if (success && success['id'] && success['idCaja']) { //si se devuelve un id de sesion
            CajaStorage.abrirCaja(success)
            setSesionAbierta(true);
        } else if (errorMonto) { //si el monto no coincide
            toast.error(errorMonto)
        } else { //si no se pudo abrir la caja
            toast.error("Error al abrir caja. Revise la conexión.");
        }
    }

    return (
        <>
            <ModalRegistrarCaja open={openRegistrarModal} closeModal={() => { setOpenRegistrarModal(false) }} toast={toast} fetchFunction={fetchCajas} />

            <CartaPrincipal>
                {/*TODO: agregar react-select para la seleccion de caja*/}
                {/*{req_cajas.items && (
                    <Select />
                )}*/}
                {/**/}

                {((rol === "ADMIN") || (rol === RolEnum.ADMIN)) && <div className="d-flex justify-content-between">
                    <Btn id="btn-ver-cajas" type="primary" className='mt-3 align-self-start' loading={cargandoSesion} disabled={(cargandoSesion)} icon={<ListIcon />}
                        onClick={() => { navigate("/caja/lista") }}>
                        Ver Cajas
                    </Btn>
                    <Btn id="btn-registrar-caja" type="primary" className='mt-3 align-self-end' loading={cargandoSesion} disabled={(cargandoSesion)} icon={<IoAdd />}
                        onClick={() => { setOpenRegistrarModal(true) }}>
                        Registrar Nueva Caja
                    </Btn>
                </div>}

                <div className="d-flex align-items-center justify-content-center my-auto">
                    <div className="d-flex flex-column p-4 py-5 card " style={{ "width": "30rem", marginLeft: 0, marginRight:0 }}>
                        <Formik
                            initialValues={{
                                id_caja: '',
                                montoInicial: ''
                            }}
                            validationSchema={Yup.object({
                                id_caja: Yup.string()
                                    .required('Requerido'),
                            })}
                            onSubmit={async (values) => {
                                handleAbrirCaja(values)
                            }}
                        >
                            <Form className="d-flex flex-column gap-2 formaFont" style={{ minHeight: 364 }}>
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
                                                id="input-select-cajas"
                                            >
                                                <option value="">Selecciona una Caja</option>
                                                {req_cajas.items.map(caja => (
                                                    <option key={caja.id} value={caja.id}>{caja.nombre}</option>
                                                ))}
                                            </FormSelect>
                                            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}></Pagination>
                                        </>
                                    ) : (
                                        <p className="pt-2">No se encontraron cajas, registra una nueva caja.</p>
                                    )
                                )}

                                <Btn id="btn-abrir-caja" type="primary" className='mt-3 align-self-end mt-auto' loading={cargandoSesion} disabled={((cargandoSesion || cargandoCajas || abrirDisabled))}
                                    submit >
                                    Abrir Caja
                                </Btn>
                            </Form>
                        </Formik>
                    </div>
                </div>

            </CartaPrincipal>
        </>
    );
}

export default CajaMainForm;
