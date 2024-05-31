import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePlanes } from "../../../hooks/usePlanes";
import ModalBase from "../../../components/modals/ModalBase";
import "../../clients/InfoClients.css";
import FlechaAtras from "../../../components/flechaAtras/FlechaAtras";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";
import { Btn } from "../../../components/bottons/Button";
import TablaEjercicios from "../../../components/tablas/TablaEjercicios";
import FormularioEjercicios from "../../../components/Formularios/FormularioEjercicios";
import { useNavigate } from "react-router-dom";
import { ListaVacía } from "../../../components/errores/ListaVacía";

const DetalleEntrenamiento = () => {
  const { id } = useParams();
  const { getProgramasById } = usePlanes();
  const [programa, setPrograma] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ejercicios, setEjercicios] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchPrograma();
  }, [id]);

  const fetchPrograma = async () => {
    try {
      const res = await getProgramasById(id);
      setPrograma(res);
      if(res.items.length === 0){
        setNotFound(true);
      }
      else{
        setNotFound(false);
      }
    } catch (error) {
      console.error("Error al obtener los detalles del entrenamiento:", error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditModal(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAgregarEjercicio = (nuevoEjercicio) => {
    setEjercicios([...ejercicios, nuevoEjercicio]);
    handleCloseModal();
  };

  const handleAgregarPlanACliente = () => {
    navigate(`/planes-entrenamiento/${"principiante"}/${id}/cliente/asignar`);
  };

  const isVacio = () => {
    if (notFound)
      return <ListaVacía mensaje="No hay entrenamientos disponibles." />;
  }

  return (
    <CartaPrincipal>
      {programa ? (
        <>
          {/* Modal */}
          {showModal && (
            <ModalBase
              open={showModal || showEditModal}
              title={showModal ? "Crear Nuevo Ejercicio" : "Editar Ejercicio"}
              closeModal={handleCloseModal}
            >
              <FormularioEjercicios />
            </ModalBase>
          )}

          <div className="info-programa">
            <div className="d-flex align-items-center gap-3">
              <FlechaAtras ruta="/planes-entrenamiento/principiante" />
              <h2>{programa.titulo}</h2>
            </div>
            <div className="float-end">
              <Btn
                id="btn-ver-clientes"
                type="secondary"
                outline
                style={{ marginTop: "-3.5rem", marginRight: "1rem" }}
                onClick={handleAgregarPlanACliente}
              >
                Ver clientes
              </Btn>
              <Btn
                id="btn-nueva-venta"
                type="primary"
                style={{ marginTop: "-3.5rem" }}
                onClick={handleOpenModal}
              >
                + Nuevo ejercicio
              </Btn>
            </div>
            <div className="datos-extras">
              <div>
                <h4 style={{ fontSize: "30px", color: "#667085" }}>Nivel</h4>
                <p style={{ fontSize: "20px", textAlign: "center" }}>
                  {programa.nivel}
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "30px", color: "#667085" }}>
                  Actividad
                </h4>
                <p style={{ fontSize: "20px" }}>{programa.actividad}</p>
              </div>
              <div>
                <h4 style={{ fontSize: "30px", color: "#667085" }}>Sexo</h4>
                <p style={{ fontSize: "20px", textAlign: "center" }}>
                  {programa.sexo}
                </p>
              </div>
            </div>
          </div>
          {/*Renderiza la tabla de los ejercicios*/}
          <TablaEjercicios
            programaId={id}
            page={currentPage}
            setParentTotalPages={setTotalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="row">
          <div className="col-12">
            <p>Cargando...</p>
          </div>
        </div>
      )}
    
    </CartaPrincipal>
  );
};

export default DetalleEntrenamiento;
