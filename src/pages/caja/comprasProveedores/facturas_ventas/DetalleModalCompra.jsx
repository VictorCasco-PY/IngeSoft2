import React, { useEffect, useState } from "react";
import CobrarProveedores from "./CobrarProveedores";
import { Btn } from "../../../../components/bottons/Button";
import api from "../../../../utils/api";
import { Toaster, toast } from "react-hot-toast";

const DetalleModalCompra = ({
  factura,
  detallesParaEnviar,
  detallesParaMostrar,
  closeModal,
  open,
  resetForm,
}) => {
  const { fecha, nombreProveedor, rucProveedor, direccion, total } = factura;
  const detalles = detallesParaEnviar;
  const [cobroModalOpen, setCobroModalOpen] = useState(false);
  const [data, setData] = useState({
    factura,
    detalles,
  });
  const [cabecera, setCabecera] = useState();
  console.log("Datos", data);

  const handleOpenCobroModal = () => {
    closeModal();
    setCobroModalOpen(true);
  };

  const handleCloseCobroModal = () => {
    setCobroModalOpen(false);
  };

  const handleSubmitFactura = async () => {
    try {
      const response = await api.post("/facturas-proveedores", data);

      // Guardar el ID de la nueva factura en el estado local
      const newCabecera = response.data.factura;

      toast.success("Factura guardada correctamente");
      setCobroModalOpen(true);

      // Actualizar el estado de la cabecera después de asegurarse de que se ha guardado correctamente
      setCabecera(newCabecera);

      setCobroModalOpen(true);
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
        <div className="modal-dialog modal-dialog-centered">
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
                {nombreProveedor}
              </p>
              <p>
                <strong>RUC: </strong>
                {rucProveedor}
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
                      <td className="py-2">
                        {detalle.iva === 0.05
                          ? 5
                          : detalle.iva === 0.1
                          ? 10
                          : detalle.iva}
                        %
                      </td>
                      <td className="py-2">
                        {detalle.subtotal.toLocaleString("es-ES")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4">
                <b>
                  Total: {total.toLocaleString("es-ES")} Gs.
                  <br />
                </b>
              </p>
            </div>
            <div className="modal-footer">
              <Btn type="secondary" onClick={closeModal}>
                Cerrar
              </Btn>

              <Btn type="primary" onClick={handleSubmitFactura}>
                Guardar factura
              </Btn>
            </div>
          </div>
        </div>
      </div>
      {cobroModalOpen && (
        <CobrarProveedores
          factura={cabecera}
          closeModal={handleCloseCobroModal}
          open={cobroModalOpen}
          resetForm={resetForm}
        />
      )}
    </>
  );
};

export default DetalleModalCompra;
