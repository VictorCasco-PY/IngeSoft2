import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Btn } from "../../components/bottons/Button";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";
import { useNavigate } from "react-router-dom";
import { HiOutlineClock } from "react-icons/hi";
import { Toaster } from "react-hot-toast";
import "../caja/administrarCaja/AdministrarCaja.css";

const PlanesVista = () => {
  const navigate = useNavigate();

  const [disabledCerrarCaja, setDisabledCerrarCaja] = useState(false);

  const goToPlaneamientoPrincipiante = () => {
    if (disabledCerrarCaja) return;
    navigate("/caja/compras");
  };

  const goToListaPrincipiante = () => {
    if (disabledCerrarCaja) return;
    navigate("/caja/lista-compras");
  };

  const goToPlaneamientoIntermedio = () => {
    if (disabledCerrarCaja) return;
    navigate("/caja/ventas");
  };

  const goToListaIntermedio = () => {
    if (disabledCerrarCaja) return;
    navigate("/caja/lista-ventas");
  };

  const goToPlaneamientoAvanzado = () => {
    if (disabledCerrarCaja) return;
    navigate("/caja/pendientes");
  };
  const goToListaAvanzado = () => {
    if (disabledCerrarCaja) return;
    navigate("/caja/pendientes");
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

      <CartaPrincipal>
        <div className="d-flex align-items-center justify-content-center gap-3 flex-column">
          <h1>Planes de Entrenamiento</h1>
        </div>

        <div className="d-flex gap-5 justify-content-center mt-5 flex-md-row flex-sm-column align-items-center cajasContainer">
          <div className="card cajaCard">
            <p className="cajaFont">Principiante</p>

            <Btn
              id="btn-nueva-venta"
              type="primary"
              onClick={goToPlaneamientoIntermedio}
              disabled={disabledCerrarCaja}
            >
              Nuevo Planeamiento
            </Btn>

            <Btn
              id="btn-listar-ventas"
              outline
              onClick={goToListaIntermedio}
              disabled={disabledCerrarCaja}
            >
              Ver Planeamientos
            </Btn>
          </div>
          <div className="card cajaCard">
            <p className="cajaFont">Intermedio</p>

            <Btn
              id="btn-nueva-compra"
              type="primary"
              onClick={goToPlaneamientoPrincipiante}
              disabled={disabledCerrarCaja}
            >
              Nuevo Planeamiento
            </Btn>

            <Btn
              id="btn-listar-compras"
              outline
              onClick={goToListaPrincipiante}
              disabled={disabledCerrarCaja}
            >
              Ver Planeamientos
            </Btn>
          </div>
          <div className="card cajaCard">
            <p className="cajaFont">Avanzado</p>

            <Btn
              id="btn-listar-cobros"
              type="primary"
              onClick={goToPlaneamientoAvanzado}
              disabled={disabledCerrarCaja}
            >
              Nuevo Planeamiento
            </Btn>
            <Btn
              id="btn-listar-compras"
              outline
              onClick={goToListaAvanzado}
              disabled={disabledCerrarCaja}
            >
              Ver Planeamientos
            </Btn>
          </div>
        </div>
      </CartaPrincipal>
    </>
  );
};

export default PlanesVista;
