import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
import IndicadorClientes from "../../components/ManejoStock/IndicadorClientes";
import ButtonCrear from "../../components/bottons/ButtonCrear";
import { IoArrowBackSharp } from "react-icons/io5";
import EstadoPago from "../../components/estado_pago/EstadoPago";

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
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [modalidad, setModalidad] = useState("MENSUAL");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState(null);
  const [searchCedulaTerm, setSearchCedulaTerm] = useState("");
  const [searchCedulaResults, setSearchCedulaResults] = useState([]);

  useEffect(() => {
    fetchSuscripciones(id, currentPage);
  }, [id, currentPage]);

  useEffect(() => {
    if (modalOpen) {
      fetchClientes();
    }
  }, [modalOpen]);
  

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
      const response = await api.get(`/actividades/${id}/suscripciones/page/${page}`);
      setSuscripciones(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error al obtener las suscripciones:", error);
    }
  };

  const fetchClientes = async (page = 1, allClientes = []) => {
    try {
      const response = await api.get(`/clientes/page/${page}`);
      const clientesData = response.data.items;
      const updatedClientes = [...allClientes, ...clientesData];
      setClientes(updatedClientes);
      if (response.data.hasNextPage) {
        // Si existe mas paginas llama a las que faltan 
        fetchClientes(page + 1, updatedClientes);
      }
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  const handleFiltrar = (filtro) => {
    setFiltro(filtro);
  };

  const suscripcionesFiltradas = suscripciones.filter((suscripcion) => {
    if (filtro === "") {
      return true; 
    } else {
      return suscripcion.suscripcionDto.estado.toLowerCase() === filtro.toLowerCase();
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
      ].join(" ").toLowerCase();
  
      return suscripcionData.includes(term.toLowerCase());
    });
    setSuscripciones(filtered);
  };

  const handleSubmitSuscripcion = async (event) => {
    event.preventDefault();
  
    if (!fechaInicio) {
      toast.error("Falta llenar campos. Ingresa una fecha de inicio.");
      return;
    }

    if (!selectedCliente) {
      toast.error("Falta llenar campos. Ingresa un cliente.");
      return;
    }

    try {
      const suscripcionData = {
        clienteId: selectedCliente.id,
        actividadId: id,
        modalidad: modalidad,
        estado: "PENDIENTE",
        fechaInicio: fechaInicio,
      };
      const response = await api.post("/suscripciones", [suscripcionData]);
      console.log("Suscripciones agregadas:", response.data);
      toast.success("Suscripción agregada exitosamente");
      setModalOpen(false);
      setSelectedCliente("");
      setModalidad("MENSUAL");
      setFechaInicio("");

      fetchSuscripciones(id, currentPage);
    }  catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          toast.error("El cliente ya posee esa actividad.");
        } else if (error.response.status === 400 && error.response.data.code === "400 BAD_REQUEST") {
          toast.error("El cliente ya posee una suscripcion");
        } else {
          console.error(
            "Error en la respuesta del servidor:",
            error.response.data
          );
          toast.error(
            "" + error.response.data.message
          );
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
        console.log(editingSubscription.suscripcionDto.id)
      setLoading(true); // Establecer el estado de carga a true
      console.log(editingSubscription)
      await api.put(`/suscripciones/${editingSubscription.suscripcionDto.id}`, editingSubscription.suscripcionDto);
      toast.success("Suscripción actualizada exitosamente");
      setModalOpenEdit(false);
      setEditingSubscription(null);
      fetchSuscripciones(id, currentPage); 
    } catch (error) {
      console.error("Error al actualizar la suscripción:", error);
      toast.error("Error al actualizar la suscripción");
    } finally {
      setLoading(false); // Establecer el estado de carga a false después de que se complete la solicitud
    }
  };

  // eliminar una suscripcion
  const handleEliminarSuscripcion = async (suscripcionId) => {
    try {
      await api.delete(`/suscripciones/con-detalles/${suscripcionId}`);
      toast.success("Suscripción eliminada exitosamente");
      fetchSuscripciones(id, currentPage); // Actualiza la lista de suscripciones después de eliminar
    } catch (error) {
      console.error("Error al eliminar la suscripción:", error);
      toast.error("Error al eliminar la suscripción");
    }
  };
  const handleShowAlert = (servicio) => {
    setServicioToDelete(servicio);
    setShowAlert(true);
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

  // manejar la cedula del cliente
  const searchByCedula = () => {
    const filtered = clientes.filter((cliente) =>
      cliente.cedula.toLowerCase().includes(searchCedulaTerm.toLowerCase())
    );
    setSearchCedulaResults(filtered);
  };
  const handleSearchCedulaChange = (event) => {
    const term = event.target.value;
    setSearchCedulaTerm(term);

    // buscar si mayor o igual a 3 caracteres
    if (term.length >= 3) {
      searchByCedula();
    } else {
      setSearchCedulaResults([]);
    }
  };

  const handleSelectCliente = (clientId) => {
    setSelectedCliente(clientId);
    setSearchCedulaTerm(""); 
    setSearchCedulaResults([]); 
  };
  //buscador mejorado 
  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  
    if (term === "") {
      // Si el input de búsqueda está vacío, vuelve a la primera página
      setCurrentPage(1);
      fetchSuscripciones(id, 1);
    }
  };
  
  const handleSearchChange = () => {
    console.log(searchTerm);
    if (searchTerm.length >= 4) {
      searchServicios(searchTerm); // Usa searchTerm en lugar de term
    } else {
      fetchSuscripciones(id, currentPage); 
    }
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
      <div class="card">
        <div class="container">
          <div className="card-1">
            <div className="title-container">
              <Link to="/servicios" className="back-link">
                <IoArrowBackSharp className="back-icon" />
              </Link>
              <h2 className="title">Clientes {actividadNombre}</h2>
            </div>
            <div className="card-body d-flex align-items-center ">
              <form className="d-flex flex-grow-1">
              <input
                  id="Btn-Buscar"
                  className="form-control mt-3 custom-input"
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
             

<ButtonBasic
  id="Btn-Buscar"
  text="Buscar"
  onClick={handleSearchChange} // Mantén el onClick para llamar a la función handleSearchChange
/>
  
  
              </form>
              <div className="dropdown">
                <button
                  id="Btn-Filtrar"
                  type="button"
                  className="btn btn-secundary dropdown-toggle btn-filtrar"
                  data-bs-toggle="dropdown"
                  style={{ fontSize: "1.02rem" }}
                >
                  Filtrar por estado
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item"  id="Btnpagado" onClick={() => handleFiltrar("pagado")}>
                      Pagado
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item"  id="BtnPendiente" onClick={() => handleFiltrar("pendiente")}>
                      Pendiente
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item"  id="Btn-todos" onClick={() => handleFiltrar("")}>
                      Todos
                    </button>
                  </li>
                </ul>
              </div>
              <ButtonCrear
                id="Btn-Crear"
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
                  <th scope="col">Estado <TbArrowDown /></th>
                  <th scope="col">Plan <GoQuestion /></th>
                  <th scope="col">Email</th>
                  <th scope="col">Numero de telefono</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {suscripcionesFiltradas.map((suscripcion) => (
                  <tr key={suscripcion.id}>
                    <td>
                      <Link to={`/clientesinfo/${suscripcion.clienteDto.id}`}>
                        {suscripcion.clienteDto.nombre}
                      </Link>
                    </td>
                    <td><EstadoPago estado={suscripcion.suscripcionDto.estado} /></td>
                    <td>{suscripcion.suscripcionDto.modalidad}</td>
                    <td>{suscripcion.clienteDto.email}</td>
                    <td>{suscripcion.clienteDto.telefono}</td>
                    <td className="custom-table2">
  <a href="#"  style={{ marginRight: "15%" }} id={`eliminar-${suscripcion.suscripcionDto.id}`}  onClick={() => handleEliminarSuscripcion(suscripcion.suscripcionDto.id)}>
    <RiDeleteBinLine />
  </a>
                      <a href="#" id={`editar-${suscripcion.suscripcionDto.id}`} onClick={() => handleEditSubscription(suscripcion)}> {/* Agregar onClick para editar */}
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
             id="paginacion"
              count={totalPages}
              shape="rounded"
              color="secondary"
              onChange={(event, page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
      <ModalBase
      id="ModalAgregar"
      title="Agrgar Cliente"
        open={modalOpen}
        closeModal={() => {
          setModalOpen(false); 
          // Limpiar los campos 
          setSelectedCliente("");
          setModalidad("MENSUAL");
          setFechaInicio("");
        }}     
      >
        <form onSubmit={handleSubmitSuscripcion}>
          <div>
            <div className="label-container">
              <LabelBase label="Modalidad de membresia:" htmlFor="modalidad" />
              <span className="required">*</span>
            </div>
            <select
             id="selecModalidad"
              className="select"
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
            >
              <option value="MENSUAL">Mensual</option>
              <option value="SEMANAL">Semanal</option>
            </select>
          </div>
          <div>
            <div className="label-container">
              <LabelBase label="Fecha de inicio:" htmlFor="modalidad" />
              <span className="required">*</span>
            </div>
            <input
             id="Agregarfechainicio"
              className="select-activity"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>


          <div>
            <div className="label-container">
              <LabelBase label="Seleccione un cliente:" htmlFor="clientes" />
              <span className="required">*</span>
            </div>
            <input
            id="EscribirCedula"
              type="text"
              className="select"
              placeholder="Ingrese la cedula del cliente"
              value={searchCedulaTerm}
              onChange={handleSearchCedulaChange}
            />
            {/* Buscar por CI  */}
            <ul>
              {searchCedulaResults.map((cliente) => (
                <a id="listarInfo" className="select-activity" key={cliente.id} href="#" onClick={() => handleSelectCliente(cliente)}>
                {cliente.nombre} CI: {cliente.cedula}
              </a>
              ))}
            </ul>
          </div>
          {selectedCliente && (
    <p>Seleccionado: {selectedCliente.nombre} CI: {selectedCliente.cedula}</p>
  )}
          <div className="campo-obligatorio">
            <span className="required">*</span>
            <span className="message">Campo obligatorio</span>
          </div>
          <div className="d-flex justify-content-center align-items-center float-end">
            <ButtonBasic
             id="Btn-guardar"
              text="Guardar"
              type="submit"
              onClick={handleSubmitSuscripcion}
            >
              {loading ? "Cargando..." : "Guardar Cambios"}
            </ButtonBasic>
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
                <LabelBase label="Modalidad de membresía:" htmlFor="modalidad" />
                <span className="required">*</span>
              </div>
              <select
                className="select"
                id="selecModalidad"
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
                <option value="MENSUAL">Mensual</option>
                <option value="SEMANAL">Semanal</option>
              </select>
            </div>
            <div>
              <div className="label-container">
                <LabelBase label="Fecha de inicio:" htmlFor="modalidad" />
                <span className="required">*</span>
              </div>
              <input
               id="fechaInicioEdit"
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
              id="fechaFinEdit"
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
              id="selecionIDactividad"
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
              id="GuardarEdit"
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

    </div>
  );
};

export default InfoServicios;
