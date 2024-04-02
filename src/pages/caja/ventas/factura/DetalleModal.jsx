import React, { useEffect, useState } from "react";
import CobroModal from "../lista/CobroModal";
import { Btn } from "../../../../components/bottons/Button";
import api from "../../../../utils/api";
import { Toaster, toast } from "react-hot-toast";

const DetalleModal = ({
  factura,
  detallesParaEnviar,
  detallesParaMostrar,
  closeModal,
  open,
}) => {
  const { nroFactura, fecha, nombreCliente, rucCliente, direccion } = factura;
  const detalles = detallesParaEnviar;
  const [cobroModalOpen, setCobroModalOpen] = useState(false);
  const [data, setData] = useState({
    factura,
    detalles,
  });
  console.log(data);

  const handleOpenCobroModal = () => {
    closeModal();
    setCobroModalOpen(true);
  };

  const handleCloseCobroModal = () => {
    setCobroModalOpen(false);
  };

  const handleSubmitFactura = async () => {
    try {
      const response = await api.post("/facturas", data);
      toast.success("Factura guardada correctamente");
    } catch (error) {
      toast.error("Error al guardar la factura");
    }
  };

  return (
    <>
      <div>
        <Toaster position="top-right" />
      </div>
      <div
        className={`modal ${open ? "show" : ""}`}
        tabIndex="-1"
        style={{ display: open ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Factura</h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Fecha de emisión: </strong> {fecha}
              </p>
              <p>
                <strong>Razón social: </strong>
                {nombreCliente}
              </p>
              <p>
                <strong>RUC: </strong>
                {rucCliente}
              </p>
              <p>
                <strong>Dirección: </strong>
                {direccion}
              </p>

              {/* Detalles de la factura */}
              <table className="table">
                <thead>
                  <tr>
                    <th>Cantidad</th>
                    <th>Descripción</th>
                    <th>Precio Unitario</th>
                    <th>IVA</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesParaMostrar.map((detalle, index) => (
                    <tr key={index}>
                      <td className="py-2">{detalle.cantidad}</td>
                      <td className="py-2">{detalle.descripcion}</td>
                      <td className="py-2">
                        {detalle.precioUnitario.toLocaleString("es-ES")}
                      </td>
                      <td className="py-2">{Number(detalle.iva)}%</td>
                      <td className="py-2">
                        {detalle.subtotal.toLocaleString("es-ES")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <Btn type="secondary" onClick={closeModal}>
                Cerrar
              </Btn>

              <Btn type="secondary" outline onClick={handleSubmitFactura}>
                Guardar factura
              </Btn>

              <Btn type="primary" onClick={handleOpenCobroModal}>
                Cobrar factura
              </Btn>
            </div>
          </div>
        </div>
      </div>
      {cobroModalOpen && (
        <CobroModal
          factura={factura}
          closeModal={handleCloseCobroModal}
          open={cobroModalOpen}
        />
      )}
    </>
  );
};

export default DetalleModal;
