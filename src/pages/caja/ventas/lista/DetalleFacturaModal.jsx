import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import CobroModal from "./CobroModal";
import { Btn } from "../../components/bottons/Button";

const DetalleFacturaModal = ({ factura, closeModal, open }) => {
  const { nroFactura, fecha, nombreCliente, rucCliente, direccion, pagado } =
    factura.factura;
  const detalles = factura.detalles;
  const [actividadNombres, setActividadNombres] = useState({});
  const [cobroModalOpen, setCobroModalOpen] = useState(false);

  useEffect(() => {
    const obtenerNombreActividad = async () => {
      try {
        const nombres = {};
        await Promise.all(
          detalles.map(async (detalle) => {
            if (detalle.suscripcionId) {
              const response = await api.get(
                `/suscripciones/${detalle.suscripcionId}`
              );
              nombres[detalle.suscripcionId] = response.data.actividadNombre;
            }
          })
        );
        setActividadNombres(nombres);
      } catch (error) {
        console.log("Error al obtener nombres de actividad:", error);
      }
    };

    obtenerNombreActividad();
  }, [detalles]); // Se ejecuta cada vez que cambian los detalles de la factura

  const handleOpenCobroModal = () => {
    closeModal();
    setCobroModalOpen(true);
  };

  const handleCloseCobroModal = () => {
    setCobroModalOpen(false);
  };

  return (
    <>
      <div
        className={`modal ${open ? "show" : ""}`}
        tabIndex="-1"
        style={{ display: open ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">N° Factura {nroFactura}</h5>
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

              {/* Renderiza los detalles de la factura */}
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
                  {detalles.map((detalle, index) => (
                    <tr key={index}>
                      <td className="py-2">{detalle.cantidad}</td>
                      <td className="py-2">
                        {detalle.suscripcionId
                          ? actividadNombres[detalle.suscripcionId]
                          : detalle.productoNombre}
                      </td>
                      <td className="py-2">
                        {detalle.precioUnitario.toLocaleString("es-ES")}
                      </td>
                      <td className="py-2">{Number(detalle.iva) * 100}%</td>
                      <td className="py-2">
                        {detalle.subtotal.toLocaleString("es-ES")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <Btn type="secondary" outline onClick={closeModal}>
                Cerrar
              </Btn>
              {pagado ? (
                ""
              ) : (
                <Btn type="primary" onClick={handleOpenCobroModal}>
                  Cobrar factura
                </Btn>
              )}
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

export default DetalleFacturaModal;
