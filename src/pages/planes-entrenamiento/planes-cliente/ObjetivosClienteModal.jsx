import React, { useEffect, useState } from "react";
import ModalBase from "../../../components/modals/ModalBase";
import api from "../../../utils/api";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { Btn } from "../../../components/bottons/Button";
import { useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
const ObjetivosClienteModal = ({ open, closeModal, objetivoId, clienteId }) => {
  const [ejercicios, setEjercicios] = useState([]);
  const [porcentaje, setPorcentaje] = useState(0);
  const [programaNombre, setProgramaNombre] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [showTable, setShowTable] = useState(false);
  let { id } = useParams();

  const toggleTable = (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto
    event.stopPropagation(); // Detener la propagación del evento
    setShowTable(!showTable); // Cambia el estado de visibilidad de la tabla
  };

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await api.get(
          `/programas/${id}/clientes/${objetivoId}`
        );
        const clienteData = response.data;
        setEjercicios(clienteData.clienteProgramaItem);
        setPorcentaje(clienteData.porcentaje);
        setProgramaNombre(clienteData.programa);
        setClienteNombre(clienteData.nombreCliente);
      } catch (error) {
        toast.error("Error al listar objetivos");
      }
    };

    if (open && objetivoId) {
      fetchEjercicios();
    }
  }, [open, objetivoId]);

  const handleCheck = (id) => {
    const updatedEjercicios = ejercicios.map((item) => {
      if (item.id === id) {
        return { ...item, logrado: !item.logrado };
      }
      return item;
    });
    setEjercicios(updatedEjercicios);

    const completados = updatedEjercicios.filter((item) => item.logrado).length;
    const totalEjercicios = updatedEjercicios.length;
    const nuevoPorcentaje = (completados / totalEjercicios) * 100;
    setPorcentaje(nuevoPorcentaje);
  };

  const handleSave = async () => {
    try {
      await api.put(`/programas/${id}/clientes/${objetivoId}`, {
        id: objetivoId,
        active: true,
        programaId: id,
        programa: programaNombre,
        clienteId: clienteId,
        nombreCliente: clienteNombre,
        clienteProgramaItem: ejercicios,
      });
      toast.success("Objetivos actualizados correctamente!");
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      toast.error("Error al actualizar los objetivos");
    }
  };

  const progressPercentage = porcentaje;

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
            <div className="col">{programaNombre}</div>
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
                  {ejercicios.map((item) => (
                    <tr key={item.id}>
                      <td>{item.programaItem.nombre}</td>
                      <td>{item.programaItem.descripcion}</td>
                      <td>{item.programaItem.tiempo}</td>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={item.logrado || false}
                          onChange={() => handleCheck(item.id)}
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
          <Btn type="primary" onClick={handleSave}>
            Guardar
          </Btn>
        </div>
      </ModalBase>
    </>
  );
};

export default ObjetivosClienteModal;
