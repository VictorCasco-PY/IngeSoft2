import React, { useState } from "react";
import { Btn } from "../../../components/bottons/Button";
import api from "../../../utils/api";
import FlechaAtras from "../../../components/flechaAtras/FlechaAtras";
import { Table } from "../../../components/table/Table";
import AsignarPlanAClienteModal from "./AsignarPlanAClienteModal";

const AsignarPlanACliente = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        className="d-flex align-items-center"
        style={{ marginTop: "1.5rem" }}
      >
        <FlechaAtras ruta="/planes-entrenamiento" />
        <h1 style={{ marginLeft: "3rem" }}>Clientes de Cardio</h1>
      </div>
      <div className="row d-flex align-items-center mb-3">
        <div className="col-4">
          <input
            id="input-search"
            type="text"
            className="form-control"
            placeholder="Buscar cliente..."
          />
        </div>
        <div className="col-1">
          <Btn id="btn-buscar" outline>
            Buscar
          </Btn>
        </div>
        <div className="col-1">
          <Btn id="btn-reset">Limpiar</Btn>
        </div>
        <div className="col-2">
          <Btn
            type="primary"
            id="btn-asignar"
            onClick={() => handleOpenModal()}
          >
            Asignar cliente
          </Btn>
        </div>
      </div>
      <Table
        headers={[
          "Nombre del cliente",
          "Tipo de plan",
          "Fecha de inicio",
          "Acciones",
        ]}
        striped
      ></Table>
      {/* Renderiza el modal si showModal es true */}
      <AsignarPlanAClienteModal
        open={showModal}
        closeModal={handleCloseModal}
      />
    </>
  );
};

export default AsignarPlanACliente;
