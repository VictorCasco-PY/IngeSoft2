import React, { useState } from "react";
import { Btn } from "../../../components/bottons/Button";
import UserStorage from "../../../utils/UserStorage";
import api from "../../../utils/api";
import styles from "./ListaActividadesCliente.module.css";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const SuscripcionModal = ({ actividad, onClose }) => {
  const [modalidad, setModalidad] = useState("MENSUAL");
  const [fechaInicio, setFechaInicio] = useState("");
  const suscripcionData = {
    clienteId: UserStorage.getEmpleadoId(),
    actividadId: actividad.id,
    modalidad,
    estado: "PENDIENTE",
    fechaInicio,
  };

  const handleSuscripcion = async () => {
    // Verificar que la fecha de inicio haya sido ingresada
    if (!fechaInicio) {
      toast.error("Por favor, seleccione una fecha de inicio.");
      return;
    }

    try {
      const response = await api.post("/suscripciones", [suscripcionData]);
      toast.success("Suscripción exitosa!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      // Manejo de errores de axios
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data || error.message;
        const errorMessage =
          serverError.message || "Error al realizar la suscripción.";
        toast.error(errorMessage);
        console.error("Error en la suscripción:", errorMessage);
      } else {
        // Manejo de errores que no son de axios
        toast.error("Error desconocido al realizar la suscripción.");
        console.error("Error al realizar la suscripción:", error);
      }
    }
  };

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
      <div className="modal show" style={{ display: "block" }}>
        <div
          className={`modal-dialog modal-dialog-centered ${styles.modalDialog}`}
        >
          <div className={`modal-content ${styles.modalContent}`}>
            <div className="modal-header">
              <h5 className="modal-title">Suscribirse a {actividad.nombre}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div>
                <label>Modalidad: </label>
                <select
                  id="select_modalidad"
                  className="form-select"
                  value={modalidad}
                  onChange={(e) => setModalidad(e.target.value)}
                >
                  <option value="MENSUAL">Mensual</option>
                  <option value="SEMANAL">Semanal</option>
                </select>
              </div>
              <div>
                <label className="form-label">Fecha de inicio: </label>
                <input
                  id="input_fecha"
                  type="date"
                  className="form-control"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <Btn type="primary" onClick={handleSuscripcion}>
                Confirmar Suscripción
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuscripcionModal;
