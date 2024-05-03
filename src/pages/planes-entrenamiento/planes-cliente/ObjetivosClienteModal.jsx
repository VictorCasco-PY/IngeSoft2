import React, { useEffect, useState } from "react";
import ModalBase from "../../../components/modals/ModalBase";
import api from "../../../utils/api";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { Btn } from "../../../components/bottons/Button";

const ObjetivosClienteModal = ({
  open,
  closeModal,
  clienteNombre,
  planNombre,
  idPlan,
}) => {
  const [ejercicios, setEjercicios] = useState([]);
  const [completados, setCompletados] = useState(0); // Estado para manejar la cantidad de ejercicios completados
  const [showTable, setShowTable] = useState(false);

  const toggleTable = (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto
    event.stopPropagation(); // Detener la propagación del evento
    setShowTable(!showTable); // Cambia el estado de visibilidad de la tabla
  };

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await api.get(`/programas/${idPlan}`);
        setEjercicios(response.data.items);
        setCompletados(
          response.data.items.filter((item) => item.completed).length
        );
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    if (open) {
      fetchEjercicios();
    }
  }, [open, idPlan]);

  const handleCheck = (id) => {
    const updatedEjercicios = ejercicios.map((ejercicio) => {
      if (ejercicio.id === id) {
        return { ...ejercicio, completed: !ejercicio.completed };
      }
      return ejercicio;
    });
    setEjercicios(updatedEjercicios);
    setCompletados(updatedEjercicios.filter((e) => e.completed).length);
  };

  const progressPercentage = (completados / ejercicios.length) * 100;

  return (
    <ModalBase
      title={<h3>{`Cliente: ${clienteNombre}`}</h3>}
      open={open}
      closeModal={closeModal}
    >
      <div className="modal-body">
        <div className="row mb-3">
          <div className="col fw-bold" style={{ fontWeight: "600" }}>
            Plan
          </div>
          <div className="col fw-bold" style={{ fontWeight: "600" }}>
            Progreso
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col">{planNombre}</div>
          <div className="col-8">
            <div
              className="progress"
              style={{
                height: "40px",
                backgroundColor: "white",
                border: "2px solid #6941C6",
                width: "100%",
              }}
            >
              <div
                className="progress-bar"
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor: "#6941C6",
                  borderRadius: "0px",
                }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span style={{ color: "white" }}>
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          </div>
          <div className="col-1">
            <button
              type="button"
              onClick={toggleTable}
              className="btn"
              style={{
                background: "none",
                color: "#6941C6",
                border: "none",
                padding: "0",
                fontSize: "24px",
              }}
            >
              {showTable ? <BsChevronUp /> : <BsChevronDown />}
            </button>
          </div>
        </div>
        {showTable && (
          <div className="mt-4">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Tiempo</th>
                  <th>Completado</th>
                </tr>
              </thead>
              <tbody>
                {ejercicios.map((ejercicio) => (
                  <tr key={ejercicio.id}>
                    <td>{ejercicio.nombre}</td>
                    <td>{ejercicio.descripcion}</td>
                    <td>{ejercicio.tiempo}</td>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={ejercicio.completed || false}
                        onChange={() => handleCheck(ejercicio.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-end">
        <Btn type="secondary" onClick={closeModal}>
          Cancelar
        </Btn>
        <Btn
          type="primary"
          onClick={() => {
            // Logic to save the changes
            console.log("Guardar cambios");
            closeModal();
          }}
        >
          Guardar
        </Btn>
      </div>
    </ModalBase>
  );
};

export default ObjetivosClienteModal;
