import React, { useState, useEffect } from "react";
import { Btn } from "../../../components/bottons/Button";
import ModalBase from "../../../components/modals/ModalBase";
import api from "../../../utils/api";
import { useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const AsignarPlanAClienteModal = ({ open, closeModal, ...props }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [fechaInicioPlan, setFechaInicioPlan] = useState("");
  const { id } = useParams();

  useEffect(() => {
    if (searchQuery.length >= 4) {
      searchClients();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSearchResults([]);
      setSelectedClient(null);
    }
  }, [open]);

  const searchClients = async () => {
    try {
      const response = await api.get(
        `/clientes/searchByName/${searchQuery}/page/1`
      );
      setSearchResults(response.data.items);
    } catch (error) {
      toast.error("Error al buscar clientes:");
    }
  };

  const handleClientSelection = (client) => {
    setSelectedClient(client);
    setSearchQuery(""); // Limpiar la búsqueda para permitir una nueva búsqueda
    setSearchResults([]); // Limpiar los resultados para que no interfieran con la visualización del cliente seleccionado
  };

  const handleClearSelection = () => {
    setSelectedClient(null);
    setSearchQuery(""); // Restablecer la búsqueda para permitir una nueva selección
  };

  const handleAsignarPlan = async (id) => {
    if (selectedClient) {
      const response = await api.post(`/programas/${id}/clientes`, {
        clienteId: selectedClient.id,
        programaId: id,
        fechaEvaluacion: fechaInicioPlan,
      });
      toast.success("Plan asignado correctamente");
      props.refreshList();
      closeModal();
    } else {
      toast.error("No se ha seleccionado ningún cliente");
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
      <ModalBase title="Asignar plan" open={open} closeModal={closeModal}>
        <div>
          <div className="mb-2">
            <label htmlFor="input_asignar" className="form-label">
              Buscar cliente:
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {selectedClient && (
            <div
              className="mb-2"
              style={{
                padding: "2px",
                border: "1px solid green",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{`${selectedClient.nombre} - ${selectedClient.cedula}`}</span>
                <button
                  onClick={handleClearSelection}
                  style={{
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                    color: "red",
                    fontSize: "24px",
                  }}
                >
                  &times;
                </button>
              </div>
            </div>
          )}
          <div>
            {searchResults.length > 0 &&
              searchResults.map((client) => (
                <div
                  key={client.id}
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    border:
                      selectedClient && selectedClient.id === client.id
                        ? "1px solid green"
                        : "none",
                  }}
                  onClick={() => handleClientSelection(client)}
                >
                  <span>{`${client.nombre} - ${client.cedula}`}</span>
                </div>
              ))}
          </div>
          <div className="mb-2">
            <label htmlFor="input_fecha" className="form-label">
              Fecha inicio del plan
            </label>
            <input
              type="date"
              className="form-control"
              value={fechaInicioPlan}
              onChange={(e) => setFechaInicioPlan(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-center align-items-center float-end mt-4 gap-3">
            <Btn onClick={closeModal}>Cerrar</Btn>
            <Btn type="primary" onClick={() => handleAsignarPlan(id)}>
              Asignar
            </Btn>
          </div>
        </div>
      </ModalBase>
    </>
  );
};

export default AsignarPlanAClienteModal;
