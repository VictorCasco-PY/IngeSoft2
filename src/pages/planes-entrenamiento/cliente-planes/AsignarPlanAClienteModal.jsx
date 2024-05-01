import React, { useState, useEffect } from "react";
import { Btn } from "../../../components/bottons/Button";
import ModalBase from "../../../components/modals/ModalBase";
import api from "../../../utils/api";

const AsignarPlanAClienteModal = ({ open, closeModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    // Realizar la solicitud al endpoint solo si la longitud de la búsqueda es mayor o igual a 4
    if (searchQuery.length >= 4) {
      searchClients();
    }
  }, [searchQuery]);

  useEffect(() => {
    // Limpiar el estado cuando se cierra el modal
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
      console.error("Error al buscar clientes:", error);
    }
  };

  const handleClientSelection = (client) => {
    setSelectedClient(client);
    setSearchQuery(""); // Limpiar el input de búsqueda al seleccionar un cliente
  };

  const handleClearSelection = () => {
    setSelectedClient(null);
  };

  const handleAssignPlan = () => {
    // Aquí puedes manejar la lógica para guardar los datos del cliente seleccionado
    if (selectedClient) {
      console.log("Cliente seleccionado:", {
        clienteId: selectedClient.id,
        fechaEvaluacion: "2024-04-27",
      });
    } else {
      console.error("No se ha seleccionado ningún cliente.");
    }
    // Cerrar el modal después de guardar los datos del cliente
    closeModal();
  };

  return (
    <>
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
          <div>
            {searchResults.map((client) => (
              <div
                key={client.id}
                className="client-data"
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  border:
                    selectedClient === client ? "1px solid green" : "none",
                }}
                onClick={() => handleClientSelection(client)}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{`${client.nombre} - ${client.cedula}`}</span>
                  {selectedClient === client && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearSelection();
                      }}
                      style={{ marginLeft: "5px", cursor: "pointer" }}
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mb-2">
            <label htmlFor="input_fecha" className="form-label">
              Fecha inicio del plan
            </label>
            <input type="date" className="form-control" />
          </div>
          <div className="d-flex justify-content-center align-items-center float-end mt-4 gap-3">
            <Btn onClick={closeModal}>Cerrar</Btn>
            <Btn type="primary" onClick={handleAssignPlan}>
              Asignar
            </Btn>
          </div>
        </div>
      </ModalBase>
    </>
  );
};

export default AsignarPlanAClienteModal;
