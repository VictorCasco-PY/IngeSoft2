import React from "react";
import { precioHandler } from "../../../utils/precioHandler";
import { Btn } from "../../../components/bottons/Button";
import styles from "./ListaActividadesCliente.module.css";

const ActividadModal = ({ actividad, onClose }) => {
  return (
    <div className="modal show" style={{ display: "block" }}>
      <div
        className={`modal-dialog modal-dialog-centered ${styles.modalDialog}`}
      >
        <div className={`modal-content ${styles.modalContent}`}>
          <div className="modal-header">
            <h3 className="modal-title">{actividad.nombre}</h3>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>Descripcion: {actividad.descripcion}</p>
            <p>Costo mensual: {precioHandler(actividad.costoMensual)} Gs.</p>
            <p>Costo semanal: {precioHandler(actividad.costoSemanal)} Gs.</p>
            <p>
              Entrenadores:{" "}
              {actividad.entrenadores.length > 0
                ? actividad.entrenadores.join(", ")
                : "No asignados"}
            </p>
          </div>
          <div className="modal-footer">
            <Btn type="primary">Suscribirse</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActividadModal;
