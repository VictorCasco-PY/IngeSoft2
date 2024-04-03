import React, { useState, useEffect } from "react";
import "./MainServicios.css";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { TbArrowDown } from "react-icons/tb";
import { GoQuestion } from "react-icons/go";
import Pagination from "@mui/material/Pagination";
import ButtonBasic from "../../components/bottons/ButtonBasic";
import ModalBase from "../../components/modals/ModalBase";
import LabelBase from "../../components/labels/LabelBase";
import CustomAlert from "../../components/alert/CustomAlert";
import Indicator from "../../components/ManejoStock/IndicadorClientes";
import { IoCheckmark } from "react-icons/io5";
import api from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import Indicador from "../../components/ManejoStock/IndicadorClientes";
import { Link } from "react-router-dom";

const MainServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServicios, setFilteredServicios] = useState([]);
  const [modalMode, setModalMode] = useState("create");
  const [servicioData, setServicioData] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    costoMensual: "",
    costoSemanal: "",
    entrenadores:[],
  });

  useEffect(() => {
    fetchServicios(currentPage);
  }, [currentPage]);

  const fetchServicios = async (page) => {
    try {
      const response = await api.get(
        `/actividades/count/clientes/page/${page}`
      );
      setServicios(response.data.items);
      setFilteredServicios(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
    }
  };

  const handleNuevoServicio = () => {
    setModalMode("create");
    setServicioData({
      id: null,
      nombre: "",
      descripcion: "",
      costoMensual: "",
      costoSemanal: "",
      entrenadores:[],
    });
    setShowModal(true);
  };

  const handleEditarServicio = (servicio) => {
    setModalMode("edit");
    setServicioData({
      id: servicio.actividad.id,
      nombre: servicio.actividad.nombre,
      descripcion: servicio.actividad.descripcion,
      costoMensual: servicio.actividad.costoMensual,
      costoSemanal: servicio.actividad.costoSemanal,
      entrenadores: servicio.actividad.entrenadores,
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditModal(false);
  };

  const handleCampoChange = (event) => {
    const { name, value } = event.target;
    setServicioData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAceptar = async () => {
    try {
      // Validar que ningún campo esté vacío
      if (
        !servicioData.nombre.trim() ||
        !servicioData.costoMensual ||
        !servicioData.costoSemanal
      ) {
        toast.error("Existen campos vacios");
        return;
      }

      if (servicioData.costoMensual < 0 || servicioData.costoSemanal < 0) {
        toast.error("Los valores no pueden ser negativos");
        return;
      }

      // Convertir a entero para comparar
      const costoMensual = parseInt(servicioData.costoMensual);
      const costoSemanal = parseInt(servicioData.costoSemanal);

      // el costo mensual debe ser mayor que el semanal
      if (costoMensual <= costoSemanal) {
        toast.error("El costo mensual debe ser mayor que el costo semanal");
        return;
      }

      let response;
      if (modalMode === "create") {
        response = await api.post("/actividades", servicioData);
        toast.success("Servicio creado satisfactoriamente");
      } else if (modalMode === "edit") {
        response = await api.put(
          `/actividades/${servicioData.id}`,
          servicioData
        );
        toast.success("Servicio actualizado satisfactoriamente");
      }

      handleCloseModal();
      fetchServicios(currentPage);
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      toast.error("Error al procesar la solicitud");
    }
  };

  const handleEliminarServicio = async () => {
    if (servicioToDelete) {
      try {
        await api.delete(`/actividades/${servicioToDelete.actividad.id}`);
        fetchServicios(currentPage);
        toast.success("Servicio eliminado satisfactoriamente");
      } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        toast.error("Error al eliminar el servicio");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (servicioToDelete) {
      try {
        await handleEliminarServicio();
        setShowAlert(false);
      } catch (error) {
        console.error("Error al eliminar servicio:", error);
        toast.error("Error al eliminar servicio" + error);
      }
    }
  };

  const handleShowAlert = (servicio) => {
    setServicioToDelete(servicio);
    setShowAlert(true);
  };

  const handleCancelDelete = () => {
    setShowAlert(false);
  };

  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term === "") {
      // Si el input esta vacio vuelve a la primera pagina
      setCurrentPage(1);
      setFilteredServicios(servicios);
    }
  };

  const handleSearchChange = () => {
    if (searchTerm.length >= 4) {
      searchServicios(searchTerm);
    } else {
      setFilteredServicios(servicios);
    }
  };

  const searchServicios = (term) => {
    const filtered = servicios.filter((servicio) => {
      const nombre = servicio.actividad.nombre.toLowerCase();
      return nombre.includes(term.toLowerCase());
    });
    setFilteredServicios(filtered);
  };

  return (
    <div className="MaquetaCliente">
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

      <div className="card">
        <div className="container">
          <div className="card-1">
            <h2>Servicios</h2>
            <div className="card-body d-flex align-items-center justify-content-between">
              <form className="d-flex flex-grow-1 align-items-center">
                <input
                  id="input-search"
                  className="form-control custom-input"
                  type="text"
                  placeholder="Buscar actividad..."
                  value={searchTerm}
                  onChange={handleInputChange}
                />

                <ButtonBasic
                  id="btn-buscar"
                  text="Buscar"
                  onClick={handleSearchChange} // Mantén el onClick para llamar a la función handleSearchChange
                />
              </form>

              <button
                id="btn-crear"
                className="button-t"
                onClick={handleNuevoServicio}
              >
                <IoAdd />
                Nuevo Servicio
              </button>
            </div>
          </div>

          <ModalBase
            id="ModalRegitro&edit"
            open={showModal || showEditModal}
            closeModal={handleCloseModal}
            title={showModal ? "Registrar Actividad" : "Editar Actividad"}
          >
            <p style={{ fontWeight: "bold", fontSize: "14px" }}>
              Datos de Actividad
            </p>
            <form className="mb-3">
              <div className="mb-2 block">
                <div className="label-container">
                  <LabelBase label="Nombre:" htmlFor="nombre" />
                  <span className="required">*</span>
                </div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={servicioData.nombre}
                  onChange={handleCampoChange}
                  required
                />
              </div>
              <div className="mb-2 block">
                <div className="label-container">
                  <LabelBase label="Descripción:" htmlFor="descripcion" />
                </div>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  className="form-control"
                  value={servicioData.descripcion}
                  onChange={handleCampoChange}
                ></textarea>
              </div>
              <div className="d-flex justify-content-between">
                <div
                  className="d-flex flex-column mr-2"
                  style={{ width: "100%" }}
                >
                  <div className="mb-2 block">
                    <div className="label-container">
                      <LabelBase
                        label="Costo Mensual:"
                        htmlFor="costoMensual"
                      />
                      <span className="required">*</span>
                    </div>
                    <input
                      type="number"
                      id="costoMensual"
                      name="costoMensual"
                      className="form-control"
                      style={{ width: "100%" }}
                      value={servicioData.costoMensual}
                      onChange={handleCampoChange}
                      required
                    />
                  </div>
                  <div className="mb-2 block">
                    <div className="label-container">
                      <LabelBase
                        label="Costo Semanal:"
                        htmlFor="costoSemanal"
                      />
                      <span className="required">*</span>
                    </div>
                    <input
                      type="number"
                      id="costoSemanal"
                      name="costoSemanal"
                      className="form-control"
                      value={servicioData.costoSemanal}
                      onChange={handleCampoChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="campo-obligatorio">
                <span className="required">*</span>
                <span className="message">Campo obligatorio</span>
              </div>
              <div className="d-flex justify-content-center align-items-center float-end">
                <ButtonBasic
                  id="btn-guardar"
                  text="Guardar"
                  onClick={handleAceptar}
                />
              </div>
            </form>
          </ModalBase>

          {showAlert && servicioToDelete && (
            <CustomAlert
              message={`¿Estás seguro de eliminar el servicio ${servicioToDelete.actividad.nombre}?`}
              confirmText="Aceptar"
              cancelText="Cancelar"
              id="confirmacion"
              confirmAction={handleConfirmDelete}
              cancelAction={handleCancelDelete}
            />
          )}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th scope="col">Nombre del Servicio</th>
                  <th scope="col">Clientes</th>
                  <th scope="col">Costo Mensual</th>
                  <th scope="col">Costo Semanal</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {filteredServicios.map((servicio) => (
                  <tr key={servicio.id}>
                    <td>
                      <Link to={`/infoServicio/${servicio.actividad.id}`}>
                        {" "}
                        {servicio.actividad.nombre}
                      </Link>
                    </td>
                    <td>
                      <Indicador clientes={servicio.clientes} />
                    </td>
                    <td>{servicio.actividad.costoMensual.toLocaleString()}</td>
                    <td>{servicio.actividad.costoSemanal.toLocaleString()}</td>
                    <td class="text-center">
                      <a
                        id={`btn-eliminar-actividad-${servicio.id}`}
                        href="#"
                        onClick={() => handleShowAlert(servicio)}
                      >
                        <RiDeleteBinLine />
                      </a>
                      <a
                        id={`btn-editar-actividad-${servicio.id}`}
                        href="#"
                        onClick={() => handleEditarServicio(servicio)}
                        style={{ marginLeft: "1.5em" }}
                      >
                        <FiEdit2 />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-container">
            <Pagination
              id="ModalRegitro&edit"
              count={totalPages}
              shape="rounded"
              color="secondary"
              onChange={(event, page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainServicios;
