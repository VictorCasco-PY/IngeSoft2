import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./MainServicios.css";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { TbArrowDown } from "react-icons/tb";
import { GoQuestion } from "react-icons/go";
import Pagination from "../../components/pagination/PaginationContainer";
import ButtonBasic from "../../components/bottons/ButtonBasic";
import ModalBase from "../../components/modals/ModalBase";
import LabelBase from "../../components/labels/LabelBase";
import CustomAlert from "../../components/alert/CustomAlert";
import api from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import ButtonCrear from "../../components/bottons/ButtonCrear";
import { IoArrowBackSharp } from "react-icons/io5";
import EstadoPago from "../../components/estado_pago/EstadoPago";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";
import { Btn } from "../../components/bottons/Button";
import { formatFecha } from "../../utils/Formatting";

const InfoServicios = () => {
  const { id } = useParams();
  const [suscripciones, setSuscripciones] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [actividadNombre, setActividadNombre] = useState("");
  const [filtro, setFiltro] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenEdit, setModalOpenEdit] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [modalidad, setModalidad] = useState("MENSUAL");
  const [fechaInicio, setFechaInicio] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState(null);
  const [searchCedulaTerm, setSearchCedulaTerm] = useState("");
  const [searchCedulaResults, setSearchCedulaResults] = useState([]);
  const [listaSuscripciones, setListaSuscripciones] = useState([]);

  useEffect(() => {
    fetchSuscripciones(id, currentPage);
  }, [id, currentPage]);

  useEffect(() => {
    const fetchActividadNombre = async () => {
      try {
        const response = await api.get(`/actividades/${id}`);
        setActividadNombre(response.data.nombre);
      } catch (error) {
        console.error("Error al obtener el nombre de la actividad:", error);
      }
    };

    fetchActividadNombre();
  }, [id]);

  const fetchSuscripciones = async (id, page) => {
    try {
      const response = await api.get(
        `/actividades/${id}/suscripciones/page/${page}`
      );
      setSuscripciones(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error al obtener las suscripciones:", error);
    }
  };

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFiltrar = (filtro) => {
    setFiltro(filtro);
  };

  const suscripcionesFiltradas = suscripciones.filter((suscripcion) => {
    if (filtro === "") {
      return true;
    } else {
      return (
        suscripcion.suscripcionDto.estado.toLowerCase() === filtro.toLowerCase()
      );
    }
  });

  const searchServicios = (term) => {
    const filtered = suscripciones.filter((suscripcion) => {
      const suscripcionData = [
        suscripcion.clienteDto.nombre,
        suscripcion.suscripcionDto.estado,
        suscripcion.suscripcionDto.modalidad,
        suscripcion.clienteDto.email,
        suscripcion.clienteDto.telefono,
      ]
        .join(" ")
        .toLowerCase();

      return suscripcionData.includes(term.toLowerCase());
    });
    setSuscripciones(filtered);
  };

  const handleAddSuscripcion = () => {
    if (!fechaInicio || !selectedCliente) {
      toast.error(
        "Falta llenar campos. Ingresa una fecha de inicio y un cliente."
      );
      return;
    }

    const nuevaSuscripcion = {
      clienteId: selectedCliente.id,
      clienteNombre: selectedCliente.nombre,
      actividadId: id,
      modalidad: modalidad,
      estado: "PENDIENTE",
      fechaInicio: fechaInicio,
    };

    setListaSuscripciones([...listaSuscripciones, nuevaSuscripcion]);
    setSelectedCliente("");
    setSearchCedulaTerm("");
    setModalidad("MENSUAL");
    setFechaInicio("");
  };

  const handleSubmitSuscripciones = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/suscripciones", listaSuscripciones);
      console.log("Suscripciones agregadas:", response.data);
      toast.success("Suscripciones agregadas exitosamente");
      setModalOpen(false);
      setListaSuscripciones([]);

      fetchSuscripciones(id, currentPage);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          toast.error("El cliente ya posee esa actividad.");
        } else if (
          error.response.status === 400 &&
          error.response.data.code === "400 BAD_REQUEST"
        ) {
          toast.error("El cliente ya posee una suscripcion");
        } else {
          console.error(
            "Error en la respuesta del servidor:",
            error.response.data
          );
          toast.error("" + error.response.data.message);
        }
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
        toast.error(
          "No se recibió respuesta del servidor. Verifica tu conexión a internet."
        );
      } else {
        console.error("Error al configurar la solicitud:", error.message);
        toast.error(
          "Error al configurar la solicitud. Consulta la consola para más detalles."
        );
      }
    }
  };

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
    setModalOpenEdit(true);
  };

  const handleSubmitEditSubscription = async (event) => {
    event.preventDefault();
    try {
      console.log(editingSubscription.suscripcionDto.id);
      setLoading(true);
      console.log(editingSubscription);
      await api.put(
        `/suscripciones/${editingSubscription.suscripcionDto.id}`,
        editingSubscription.suscripcionDto
      );
      toast.success("Suscripción actualizada exitosamente");
      setModalOpenEdit(false);
      setEditingSubscription(null);
      fetchSuscripciones(id, currentPage);
    } catch (error) {
      console.error("Error al actualizar la suscripción:", error);
      toast.error("Error al actualizar la suscripción");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarSuscripcion = async (suscripcionId) => {
    try {
      await api.delete(`/suscripciones/${suscripcionId}`);
      toast.success("Suscripción eliminada exitosamente");
      fetchSuscripciones(id, currentPage);
    } catch (error) {
      console.error("Error al eliminar la suscripción:", error);
      toast.error("Error al eliminar la suscripción");
    }
  };

  const handleCancelDelete = () => {
    setShowAlert(false);
  };

  const handleConfirmDelete = async () => {
    if (servicioToDelete) {
      try {
        await handleEliminarSuscripcion(servicioToDelete);
        setShowAlert(false);
      } catch (error) {
        console.error("Error al eliminar suscripción:", error);
        toast.error("Error al eliminar suscripción" + error);
      }
    }
  };

  const searchByCedula = async () => {
    try {
      const response = await api.get(
        `/clientes/searchByCi/${searchCedulaTerm}/page/1`
      );
      const cliente = response.data.items.find(
        (cliente) => cliente.cedula === searchCedulaTerm
      );
      if (cliente) {
        handleSelectCliente(cliente);
      } else {
        toast.error("La cédula ingresada no corresponde a ningún cliente.");
      }
    } catch (error) {
      console.error("La cedula no corresponde a ningun cliente:", error);
      toast.error("La cedula no corresponde a ningun cliente");
    }
  };

  const handleSelectCliente = (cliente) => {
    setSelectedCliente(cliente);
    setSearchCedulaTerm(""); // Limpiar el término de búsqueda
    setSearchCedulaResults([]);
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
        <div>
          <div className="title-container">
            <Link to="/servicios" className="back-link">
              <IoArrowBackSharp className="back-icon" />
            </Link>
            <h2 className="title">Clientes {actividadNombre}</h2>
          </div>
          <div className="card-body d-flex align-items-center ">
            <form className="d-flex flex-grow-1">
              <input
                id="input-search"
                className="form-control mt-3 custom-input"
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ButtonBasic
                id="btn-buscar"
                text="Buscar"
                onClick={() => searchServicios(searchTerm)}
              />
            </form>
            <div className="dropdown">
              <button
                id="btn-filtrar"
                type="button"
                className="btn btn-secundary dropdown-toggle btn-filtrar"
                data-bs-toggle="dropdown"
                style={{ fontSize: "1.02rem" }}
              >
                Filtrar por estado
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item"
                    id="btn-pagado"
                    onClick={() => handleFiltrar("pagado")}
                  >
                    Pagado
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    id="btn-pendiente"
                    onClick={() => handleFiltrar("pendiente")}
                  >
                    Pendiente
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    id="btn-todos"
                    onClick={() => handleFiltrar("")}
                  >
                    Todos
                  </button>
                </li>
              </ul>
            </div>
            <ButtonCrear
              id="btn-Crear"
              text="Nuevo Cliente"
              onClick={() => setModalOpen(true)}
              icon={<IoAdd />}
              color="secondary"
            />
          </div>
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th scope="col">Cliente</th>
                <th scope="col">
                  Estado <TbArrowDown />
                </th>
                <th scope="col">
                  Plan <GoQuestion />
                </th>
                <th scope="col">Email</th>
                <th scope="col">Numero de telefono</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {suscripcionesFiltradas.map((suscripcion) => (
                <tr key={suscripcion.id}>
                  <td>
                    <Link
                      id={`infoActividad${suscripcion.clienteDto.id}`}
                      to={`/clientesinfo/${suscripcion.clienteDto.id}`}
                    >
                      {suscripcion.clienteDto.nombre}
                    </Link>
                  </td>
                  <td>
                    <EstadoPago
                      estado={suscripcion.suscripcionDto.estado.toLowerCase()}
                    />
                  </td>
                  <td>{suscripcion.suscripcionDto.modalidad}</td>
                  <td>{suscripcion.clienteDto.email}</td>
                  <td>{suscripcion.clienteDto.telefono}</td>
                  <td className="custom-table2">
                    <a
                      href="#"
                      style={{ marginRight: "15%" }}
                      id={`eliminar-${suscripcion.suscripcionDto.id}`}
                      onClick={() =>
                        handleEliminarSuscripcion(suscripcion.suscripcionDto.id)
                      }
                    >
                      <RiDeleteBinLine />
                    </a>
                    <a
                      href="#"
                      id={`editar-${suscripcion.suscripcionDto.id}`}
                      onClick={() => handleEditSubscription(suscripcion)}
                    >
                      <FiEdit2 />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="align-self-center">
          <Pagination
            id="paginacion"
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </CartaPrincipal>
      <ModalBase
        id="ModalAgregar"
        title="Registrar Clientes"
        open={modalOpen}
        closeModal={() => {
          setModalOpen(false);
          setSelectedCliente("");
          setModalidad("MENSUAL");
          setFechaInicio("");
        }}
      >
        <form onSubmit={handleSubmitSuscripciones}>
          <div>
            <h5>Datos de suscripcion</h5>
            <div className="row">
              <div className="col">
                <div className="label-container">
                  <LabelBase label="Cédula del cliente:" htmlFor="cedula" />
                  <span className="required">*</span>
                </div>
                <input
                  id="cedula"
                  type="text"
                  className="form-control"
                  placeholder="Ingrese el Nº CI"
                  value={searchCedulaTerm}
                  onChange={(e) => setSearchCedulaTerm(e.target.value)}
                />
              </div>
              <div className="col" style={{ marginTop: "32px" }}>
                <Btn
                  id="btn-buscarCI"
                  type="secondary"
                  outline
                  onClick={searchByCedula}
                >
                  Buscar cliente
                </Btn>
              </div>
            </div>
            {selectedCliente && (
              <div className="mt-3">
                <span>Cliente seleccionado: {selectedCliente.nombre}</span>
              </div>
            )}
            <div className="row justify-content-between mt-3">
              <div className="col-4 my-2">
                <div className="label-container">
                  <LabelBase label="Modalidad" htmlFor="modalidad" />
                  <span className="required">*</span>
                </div>
                <select
                  id="modalidad"
                  className="form-select"
                  value={modalidad}
                  onChange={(e) => setModalidad(e.target.value)}
                >
                  <option id="mensual" value="MENSUAL">
                    Mensual
                  </option>
                  <option id="semanal" value="SEMANAL">
                    Semanal
                  </option>
                </select>
              </div>
              <div className="col-4 my-2">
                <div className="label-container">
                  <LabelBase label="Fecha de inicio:" htmlFor="fechaInicio" />
                  <span className="required">*</span>
                </div>
                <input
                  id="fechaInicio"
                  className="form-control"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className="col-4" style={{ marginTop: "42px" }}>
                <Btn
                  id="btn-agregar"
                  type="secondary"
                  onClick={handleAddSuscripcion}
                >
                  Agregar Suscripción
                </Btn>
              </div>
            </div>
          </div>

          <div className="campo-obligatorio mt-3">
            <span className="required">*</span>
            <span className="message">Campo obligatorio</span>
          </div>
          <div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Modalidad</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listaSuscripciones.map((suscripcion, index) => (
                  <tr key={index}>
                    <td>{suscripcion.clienteNombre}</td>
                    <td>{suscripcion.modalidad}</td>
                    <td>{formatFecha(suscripcion.fechaInicio)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() =>
                          setListaSuscripciones(
                            listaSuscripciones.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <RiDeleteBinLine />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center align-items-center float-end mt-3">
            <Btn
              id="btn-guardar"
              type="primary"
              onClick={handleSubmitSuscripciones}
            >
              Guardar
            </Btn>
          </div>
        </form>
      </ModalBase>

      {/* Modal para editar suscripciones */}
      <ModalBase
        id="ModalEditar"
        title="Editar Cliente"
        open={editingSubscription !== null}
        closeModal={() => setEditingSubscription(null)}
      >
        {editingSubscription && (
          <form onSubmit={handleSubmitEditSubscription}>
            <div>
              <div className="label-container">
                <LabelBase
                  label="Modalidad de membresía:"
                  htmlFor="modalidad"
                />
                <span className="required">*</span>
              </div>
              <select
                className="select"
                id="modalidadEditar"
                value={editingSubscription.suscripcionDto.modalidad}
                onChange={(e) =>
                  setEditingSubscription({
                    ...editingSubscription,
                    suscripcionDto: {
                      ...editingSubscription.suscripcionDto,
                      modalidad: e.target.value,
                    },
                  })
                }
              >
                <option id="mensual" value="MENSUAL">
                  Mensual
                </option>
                <option id="semanal" value="SEMANAL">
                  Semanal
                </option>
              </select>
            </div>
            <div>
              <div className="label-container">
                <LabelBase label="Fecha de inicio:" htmlFor="modalidad" />
                <span className="required">*</span>
              </div>
              <input
                id="fecha-InicioEdit"
                className="select-activity"
                type="date"
                value={editingSubscription.suscripcionDto.fechaInicio}
                onChange={(e) =>
                  setEditingSubscription({
                    ...editingSubscription,
                    suscripcionDto: {
                      ...editingSubscription.suscripcionDto,
                      fechaInicio: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <div className="label-container">
                <LabelBase label="Fecha de fin:" htmlFor="modalidad" />
                <span className="required">*</span>
              </div>
              <input
                id="fecha-FinEdit"
                className="select-activity"
                type="date"
                value={editingSubscription.suscripcionDto.fechaFin}
                onChange={(e) =>
                  setEditingSubscription({
                    ...editingSubscription,
                    suscripcionDto: {
                      ...editingSubscription.suscripcionDto,
                      fechaFin: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <div className="label-container">
                <LabelBase label="Nombre cliente:" htmlFor="clientes" />
                <span className="required">*</span>
              </div>
              <input
                id="nombre-cliente"
                className="select-activity"
                type="text"
                value={editingSubscription.clienteDto.nombre}
                disabled
              />
            </div>
            <div className="campo-obligatorio">
              <span className="required">*</span>
              <span className="message">Campo obligatorio</span>
            </div>
            <div className="d-flex justify-content-center align-items-center float-end">
              <ButtonBasic
                id="btn-guardarEdit"
                text="Guardar"
                type="submit"
                onClick={handleSubmitEditSubscription}
              >
                {loading ? "Cargando..." : "Guardar Cambios"}
              </ButtonBasic>
            </div>
          </form>
        )}
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
    </>
  );
};

export default InfoServicios;
