import React, { useState, useEffect } from "react";
import api from "../../../../utils/api";
import { toast, Toaster } from "react-hot-toast";
import { Btn } from "../../../../components/bottons/Button";

const CobroModal = ({ factura, closeModal, open }) => {
  const { total } = factura.factura;

  const [efectivo, setEfectivo] = useState(0);
  const [tarjeta, setTarjeta] = useState(0);
  const [cambio, setCambio] = useState(0);

  const cobrar = async () => {
    try {
      const movimiento = {
        facturaId: factura.factura.id,
        facturaProveedorId: null,
        sesionId: 1, // Este valor debo obtenerlo del localStorage cuando una mi parte con caja
        total: total,
        entrada: true,
      };

      const detalles = [];

      if (efectivo > 0) {
        detalles.push({
          tipoDePagoId: 1, // Efectivo
          monto: efectivo,
        });
      }

      if (tarjeta > 0) {
        detalles.push({
          tipoDePagoId: 2, // Tarjeta
          monto: tarjeta,
        });
      }

      const data = {
        movimiento: movimiento,
        detalles: detalles,
      };

      const response = await api.post("/movimientos", data);
      toast.success("Factura cobrada correctamente");
      closeModal();
    } catch (error) {
      toast.error("Error al cobrar la factura");
      console.error("Error al cobrar la factura:", error);
    }
  };

  const handleChangeEfectivo = (event) => {
    const value = event.target.value;
    setEfectivo(value);
  };

  const handleChangeTarjeta = (event) => {
    const value = event.target.value;
    setTarjeta(value);
  };

  useEffect(() => {
    const calcularCambio = () => {
      const totalPagado = efectivo + tarjeta;
      const cambio = total - totalPagado;
      setCambio(cambio >= 0 ? cambio.toLocaleString("es-ES") : 0);
    };

    calcularCambio();
  }, [efectivo, tarjeta]);

  return (
    <>
      <Toaster position="top-right" />
      <div
        className={`modal ${open ? "show" : ""}`}
        tabIndex="-1"
        style={{ display: open ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Cobrar factura</h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <div>
                <label htmlFor="total">Total</label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value={total.toLocaleString("es-ES")}
                />
              </div>
              <div>
                <label htmlFor="efectivo">Efectivo</label>
                <input
                  type="number"
                  name="efectivo"
                  className="form-control"
                  value={efectivo.toLocaleString("es-ES")}
                  onChange={handleChangeEfectivo}
                />
              </div>
              <div>
                <label htmlFor="tarjeta">Tarjeta</label>
                <input
                  type="number"
                  name="tarjeta"
                  className="form-control"
                  value={tarjeta.toLocaleString("es-ES")}
                  onChange={handleChangeTarjeta}
                />
              </div>
              <div>
                <label htmlFor="cambio">Transferencia</label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value={cambio}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cerrar
              </button>
              <Btn type="primary" onClick={cobrar}>
                Cobrar
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CobroModal;
