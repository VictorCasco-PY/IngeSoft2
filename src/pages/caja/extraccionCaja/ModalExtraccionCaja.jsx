import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormTextInput } from "../../../components/forms/FormInputs";
import { Btn } from "../../../components/bottons/Button";
import ModalFormik from "../../../components/modals/ModalFormik";
import UserStorage from "../../../utils/UserStorage";
import CajaStorage from "../../../utils/CajaStorage";
import { getCurrentDate } from "../../../utils/DateStatics";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useExtraccionCaja from "../../../hooks/useExtraccionCaja";

const ModalExtraccionCaja = ({ onClose, toast }) => {
  const { realizarExtraccion, isLoading, error } = useExtraccionCaja();

  const [extraccionMonto, setExtraccionMonto] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleExtraccionCaja = async (values) => {
    try {
      //formato de fecha del back 
      const formattedDate = selectedDate.toISOString().split("T")[0];

      const extraccionData = {
        idCaja: CajaStorage.getCajaId(),
        idUsuario: UserStorage.getEmpleadoId(),
        monto: values.monto,
        fecha: formattedDate,
      };

      await realizarExtraccion(extraccionData);
      toast.success("Extraccion realizada exitosamente");
      onClose();
    } catch (error) {
      toast.error("La extraccion no pudo realizarse");
      toast.error("Verifique el monto actual de la caja");
      console.error("Error al realizar la extracción de caja:", error);
      console.error(
        "Error al realizar la extracción de caja:",
        error.response.data.message
      );
    }
  };

  return (
    <ModalFormik open={true} title="Extraccion de Caja" closeModal={onClose}>
      <Formik
        initialValues={{
          monto: extraccionMonto,
        }}
        validationSchema={Yup.object({
          monto: Yup.number()
            .typeError("El monto debe ser un numero")
            .positive("Debe ser un numero positivo"),
        })}
        onSubmit={handleExtraccionCaja}
      >
        <Form>
          <div className="d-flex flex-column gap-2">
            <FormTextInput
              label="Monto (Gs)"
              id="monto"
              name="monto"
              type="text"
              placeholder="200000"
            />
            <div>
              <label>Fecha</label>
              <br />
              <DatePicker
                selected={selectedDate}
                id="fecha"
                onChange={(date) => setSelectedDate(date)}
              />
            </div>
            <div className="d-flex justify-content-end">
              <Btn onClick={onClose}
              id="btn-cancelar"
               type="secondary" 
               disabled={isLoading}
               >
                Cancelar
              </Btn>
              <Btn
                type="primary"
                id="btn-realizar"
                loading={isLoading}
                disabled={isLoading}
                submit
              >
                Realizar Extracción
              </Btn>
            </div>
          </div>
        </Form>
      </Formik>
    </ModalFormik>
  );
};

export default ModalExtraccionCaja;
