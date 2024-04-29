import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Btn } from "../../components/bottons/Button";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ModalEntrenamiento from "../../components/modals/ModalEntrenamiento";
import "../caja/administrarCaja/AdministrarCaja.css";
import EntrenamientoPrincipiante from "./planeamiento/EntrenamientoPrincipiante";
import { usePlanes } from "../../hooks/usePlanes";
const PlanesVista = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [nivelSeleccionado, setNivelSeleccionado] = useState("");
  const { crearProgramas } = usePlanes();

  const handleCrearPrograma = async (datosPrograma) => {
    try {
      await crearProgramas(datosPrograma);
      console.log("Programa creado:", datosPrograma);
    } catch (error) {
      console.error("Error al crear programa:", error);
    }
  };
  const handleOpenModal = (nivel) => {
    setShowModal(true);
    setNivelSeleccionado(nivel);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [disabledCerrarCaja, setDisabledCerrarCaja] = useState(false);
/*
  const goToPlaneamientoPrincipiante = () => {
    if (disabledCerrarCaja) return;
    navigate("/caja/compras");
  };
*/
  const goToListaPrincipiante = () => {
    if (disabledCerrarCaja) return;
    navigate("/planes-entrenamiento/principiante");
  };
/*
  const goToPlaneamientoIntermedio = () => {
    if (disabledCerrarCaja) return;
    navigate("/caja/ventas");
  };
*/
  const goToListaIntermedio = () => {
    if (disabledCerrarCaja) return;
    navigate("/planes-entrenamiento/intermedio");
  };
/*
  const goToPlaneamientoAvanzado = () => {
    if (disabledCerrarCaja) return;
    navigate("/caja/pendientes");
  };
  */
  const goToListaAvanzado = () => {
    if (disabledCerrarCaja) return;
    navigate("/planes-entrenamiento/avanzado");
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
          <h1 style={{marginTop:"4rem"}}>Planes de Entrenamiento</h1>
        </div>

        <div className="d-flex gap-5 justify-content-center mt-5 flex-md-row flex-sm-column align-items-center cajasContainer">
          <div className="card cajaCard">
            <p className="cajaFont">Principiante</p>

            <Btn
              id="btn-nueva-venta"
              type="primary"
              onClick={() => handleOpenModal("Principiante")}
              disabled={disabledCerrarCaja}
            >
              Nuevo Planeamiento
            </Btn>

            <Btn
              id="btn-listar-ventas"
              outline
              onClick={goToListaPrincipiante}
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
              onClick={() => handleOpenModal("Intermedio")}
              disabled={disabledCerrarCaja}
            >
              Nuevo Planeamiento
            </Btn>

            <Btn
              id="btn-listar-compras"
              outline
              onClick={goToListaIntermedio}
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
              onClick={() => handleOpenModal("Avanzado")}
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
        {showModal && (
        <ModalEntrenamiento
          nivel={nivelSeleccionado}
          onClose={handleCloseModal}
          onCreate={handleCrearPrograma}
        />
      )}
      </CartaPrincipal>
    </>
  );
};

export default PlanesVista;
