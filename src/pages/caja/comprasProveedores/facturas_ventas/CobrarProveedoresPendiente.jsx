import React, { useState, useEffect } from "react";
import api from "../../../../utils/api";

import { Btn } from "../../../../components/bottons/Button";

const CobrarProveedoresPendiente = ({ factura, closeModal, open,toast }) => {
  const { total, id } = factura;
  const [efectivo, setEfectivo] = useState(0);
  const [tarjeta, setTarjeta] = useState(0);
  const [transferencia, setTransferencia] = useState(0);

  const [storedValue, setStoredValue] = useState("");

  useEffect(() => {
    // Obteniendo el valor almacenado en localStorage cuando el componente se monta
    const storedItem = localStorage.getItem("sesionCajaId");

    // Actualizando el estado con el valor almacenado, si existe
    if (storedItem) {
      setStoredValue(storedItem);
    }
  }, []);

  const cobrar = async () => {
    try {
      const movimiento = {
        facturaProveedorId: factura.id,
        facturaId: null,
        sesionId: Number(storedValue), // Se obtiene el id de la sesion del LS
        total: total,
        entrada: false,
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

      if (transferencia > 0) {
        detalles.push({
          tipoDePagoId: 3, // Transferencia
          monto: transferencia,
        });
      }

      const data = {
        movimiento: movimiento,
        detalles: detalles,
      };

      const response = await api.post("/movimientos", data);
      
      toast.success("Factura cobrada correctamente");
      console.log("movimiento ", data);
      closeModal();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Error al cobrar la factura");
      console.error("Error al cobrar la factura:", error);
    }
  };

  const handleChangeEfectivo = (event) => {
    const value = event.target.value;
    setEfectivo(Number(value));
  };

  const handleChangeTarjeta = (event) => {
    const value = event.target.value;
    setTarjeta(Number(value));
  };

  const handleChangeTransferencia = (event) => {
    const value = event.target.value;
    setTransferencia(Number(value));
  };

  const handleCerrar = () => {
    closeModal();
    resetForm();
  };

  return (
    <>
      
      <div
        className={`modal ${open ? "show" : ""}`}
        tabIndex="-1"
        style={{ display: open ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Pagar factura</h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label htmlFor="total">Total</label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value={total.toLocaleString("es-ES")}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="efectivo">Efectivo</label>
                <input
                  type="number"
                  name="efectivo"
                  className="form-control"
                  value={efectivo}
                  onChange={handleChangeEfectivo}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="tarjeta">Tarjeta</label>
                <input
                  type="number"
                  name="tarjeta"
                  className="form-control"
                  value={tarjeta}
                  onChange={handleChangeTarjeta}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="cambio">Transferencia</label>
                <input
                  type="number"
                  name="transferencia"
                  className="form-control"
                  value={transferencia}
                  onChange={handleChangeTransferencia}
                />
              </div>
            </div>
            <div className="modal-footer">
              <Btn type="secondary" onClick={handleCerrar}>
                Cerrar
              </Btn>
              <Btn type="primary" onClick={cobrar}>
                Pagar Factura
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CobrarProveedoresPendiente;
