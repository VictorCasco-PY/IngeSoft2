import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import '../MainCaja.css'
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';

import useCaja from "../../../hooks/useCaja";
import ModalFormik from "../../../components/modals/ModalFormik";
import { Btn } from "../../../components/bottons/Button";
import { FormTextInput } from "../../../components/forms/FormInputs";

const ModalRegistrarCaja = ({ toast, fetchFunction, editMode, selectedCaja, ...props }) => {

    const { createCaja, modificarCaja, isLoading: cargandoCaja } = useCaja();

    const [cajaNombre, setCajaNombre] = useState('')
    const [cajaMonto, setCajaMonto] = useState('')

    useEffect(() => {
        if (editMode && selectedCaja) {
            setCajaNombre(selectedCaja.nombre)
            setCajaMonto(selectedCaja.monto)
        }
    }, [editMode, selectedCaja])

    const handleRegistrarCaja = async (values) => {

        if (cargandoCaja) return;

        const postData = {
            nombre: values['nombre'],
            monto: values['monto'],
        }

        const success = !editMode ? await createCaja(postData) : await modificarCaja(selectedCaja.id, postData)

        if (success.id) {
            props.closeModal()
            toast.success(!editMode ? "Caja registrada exitosamente" : "Caja modificada exitosamente")

            //funcion ejecutada en el componente padre si existe
            if (fetchFunction) {
                fetchFunction()
            }
        } else {
            if (success.response && success.response.status === 500) {
                //ya no se utiliza el codigo 400 para una caja existente
                //toast.error(errorCaja.response.data.message)
                toast.error("Ya existe una caja con ese nombre.")
                document.getElementById("input-nombre-caja").focus()
            } else {
                toast.error(!editMode ? "Error al registrar la caja" : "Error al modificar la caja")
            }
        }
    }

    return (
        <ModalFormik title={(!editMode && selectedCaja) ? "Registrar una Caja" : `Modificar Caja`} {...props}>
            <Formik
                initialValues={{
                    nombre: cajaNombre,
                    monto: cajaMonto,
                }}
                enableReinitialize={true}
                validationSchema={Yup.object({
                    nombre: Yup.string()
                        .max(20, 'Debe tener 20 caracteres o menos')
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
                            label="Monto (Gs)"
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
                            {editMode ? "Modificar Caja" : "Registrar Caja"}
                        </Btn>

                    </div>
                </Form>
            </Formik>
        </ModalFormik>
    );
}

export default ModalRegistrarCaja;