import React, { useState } from "react";
import { precioHandler } from "../../../utils/precioHandler";
import { Btn } from "../../../components/bottons/Button";
import styles from "./ListaActividadesCliente.module.css";
import SuscripcionModal from "./SuscripcionModal";

const ActividadModal = ({ actividad, onClose }) => {
  const [showSuscripcion, setShowSuscripcion] = useState(false);

  const handleSuscripcionClick = () => {
    setShowSuscripcion(true);
  };

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
            <p>Descripción: {actividad.descripcion}</p>
            <p>Costo mensual: {precioHandler(actividad.costoMensual)} Gs.</p>
            <p>Costo semanal: {precioHandler(actividad.costoSemanal)} Gs.</p>
            <p>
              Entrenadores: {actividad.entrenadoresNombres || "No asignados"}
            </p>
          </div>
          <div className="modal-footer">
            <Btn id="btn-suscribirse" type="primary" onClick={handleSuscripcionClick}>
              Suscribirse
            </Btn>
          </div>
          {showSuscripcion && (
            <SuscripcionModal
              actividad={actividad}
              onClose={() => setShowSuscripcion(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActividadModal;
