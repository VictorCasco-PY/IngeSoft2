import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import '../MainCaja.css'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import useCaja from "../../../hooks/useCaja";
import ModalFormik from "../../../components/modals/ModalFormik";
import { Btn } from "../../../components/bottons/Button";
import { FormTextInput } from "../../../components/forms/FormInputs";

const ModalRegistrarCaja = ({toast, ...props }) => {

    const { createCaja, data: req_caja, isLoading: cargandoCaja, error: errorCaja } = useCaja();

    const handleRegistrarCaja = async (values) => {

        if (cargandoCaja) return;

        const postData = {
            nombre: values['nombre'],
            monto: values['monto'],
        }

        const success = await createCaja(postData);

        if (success.id) {
            props.closeModal()
            toast.success("Caja registrada correctamente")
        } else {
            if (success.response && success.response.status === 500) {
                //toast.error(errorCaja.response.data.message)
                toast.error("Ya existe una caja con ese nombre.")
                document.getElementById("input-nombre-caja").focus()
            } else {
                toast.error("Error al registrar caja. Revise la conexión.")
            }
        }
    }

    return (
        <ModalFormik title={"Registrar una Caja"} {...props}>
            <Formik
                initialValues={{
                    nombre: '',
                    monto: '',
                }}
                validationSchema={Yup.object({
                    nombre: Yup.string()
                        .max(15, 'Debe tener 15 caracteres o menos')
                        .min(5, 'Debe tener 5 caracteres o más')
                        .required('Requerido'),
                    monto: Yup.number()
                        .typeError('El monto debe ser un numero')
                        .required('Requerido')
                        .positive('Debe ser un número positivo')
                })}
                onSubmit={async (values) => {
                    handleRegistrarCaja(values)
                }}
            >
                <Form>
                    <div className="d-flex flex-column gap-2">
                        <FormTextInput
                            label="Nombre"
                            name="nombre"
                            type="text"
                            placeholder="Nombre de la Caja"
                            required={true}
                            id="input-nombre-caja"
                        />
                        <FormTextInput
                            label="Monto"
                            name="monto"
                            type="text"
                            placeholder="2000000"
                            required={true}
                            id="input-monto-caja"
                        />
                        <Btn type="primary" className='mt-3 align-self-end' loading={cargandoCaja} disabled={(cargandoCaja)} 
                        id="btn-registrar-caja"
                        submit
                        >
                            Registrar Caja
                        </Btn>

                    </div>
                </Form>
            </Formik>
        </ModalFormik>
    );
}

export default ModalRegistrarCaja;