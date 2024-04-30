import React from "react";
import { Btn } from "../../../components/bottons/Button";
import api from "../../../utils/api";

const AsignarPlanACliente = () => {
  const handleAsignarPlan = async (programaId) => {
    const response = api.post(`/programas/${programaId}/clientes`, {
      clienteId: 1,
      fechaEvaluacion: "2024-04-27",
    });
  };
  return (
    <>
      <div className="modal-dialog modal-dialog-centered" tabindex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Plan de entrenamiento</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div>
                <label htmlFor="cliente" className="form-control">
                  Asignar a:
                </label>
                <input type="text" className="form-control" />
              </div>
              <div>
                <label htmlFor="fecha_evaluacion" className="form-control">
                  Fecha de evaluacion:
                </label>
                <input type="date" className="form-control" />
              </div>
            </div>
            <div className="modal-footer">
              <Btn type="secondary" outline>
                Cerrar
              </Btn>
              <Btn type="primary">Guardar</Btn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AsignarPlanACliente;
