import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./mainClients.css";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { BsSearch } from "react-icons/bs";
import { IoAdd, IoClose } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";
import { TbArrowDown } from "react-icons/tb";
import { GoQuestion } from "react-icons/go";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import LabelBase from "../../components/labels/LabelBase";
import ModalBase from "../../components/modals/ModalBase";
import ButtonBasic from "../../components/bottons/ButtonBasic";
import CustomAlert from "../../components/alert/CustomAlert";
import Pagination from "@mui/material/Pagination";
import toast, { Toaster } from "react-hot-toast";
import { IoAddOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import EstadoPago from "../../components/estado_pago/EstadoPago";
import ButtonCrear from "../../components/bottons/ButtonCrear";
const MainClients = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedActivities, setSelectedActivities] = useState([]);
  const [modalidad, setModalidad] = useState("MENSUAL");
  const [fechaInicio, setFechaInicio] = useState("");
  const [selectedClienteId, setSelectedClienteId] = useState(null);
  const [suscripcionModalOpen, setSuscripcionModalOpen] = useState(false);

  const [actividades, setActividades] = useState([]);
  const [suscripcionSuccess, setSuscripcionSuccess] = useState(false);
  const [suscripcionError, setSuscripcionError] = useState(false);
  const [total, setTotal] = useState(0);
  const [loadingActividades, setLoadingActividades] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [actividadesPage, setActividadesPage] = useState(1);

  //estado
  const [filtroEstado, setFiltroEstado] = useState("");

  const [clienteData, setClienteData] = useState({
    nombre: "",
    ruc: "",
    cedula: "",
    telefono: "",
    email: "",
    direccion: "",
  });
  const [clienteDataExtra, setClienteDataExtra] = useState({
    apellido: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Define la cantidad de elementos por página

  useEffect(() => {
    fetchClientes();
  }, [currentPage]);

  useEffect(() => {
    if (suscripcionModalOpen) {
      fetchActividades();
    }
  }, [suscripcionModalOpen, actividadesPage]);

  useEffect(() => {
    // Concatenar el apellido al nombre al cargar el componente
  }, [clienteDataExtra.apellido]);

  useEffect(() => {
    // Calcula el total cuando hay cambios en selectedActivities o modalidad
    let newTotal = 0;
    if (modalidad === "MENSUAL") {
      newTotal = selectedActivities.reduce((acc, actividad) => {
        acc += actividad.costoMensual || 0;
        return acc;
      }, 0);
    } else if (modalidad === "SEMANAL") {
      newTotal = selectedActivities.reduce((acc, actividad) => {
        acc += actividad.costoSemanal || 0;
        return acc;
      }, 0);
    }
    setTotal(newTotal);
  }, [selectedActivities, modalidad]);

  const fetchClientes = async () => {
    try {
      const response = await api.get(
        `/clientes/lista/page/${currentPage}?perPage=${itemsPerPage}`
      );
      setClientes(response.data.items);
      setFilteredClientes(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      toast.error("Error al actualizar cliente ");
    }
  };
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
};
  const searchClientes = (term) => {
    const filtered = clientes.filter((cliente) => {
      const nombre = cliente.nombre.toLowerCase();
      const email = cliente.email.toLowerCase();
      const telefono = cliente.telefono;
      const estado = cliente.estado;

      return (
        (nombre.includes(term.toLowerCase()) ||
          email.includes(term.toLowerCase()) ||
          telefono.includes(term.toLowerCase())) &&
        (filtroEstado === "" || estado === filtroEstado)
      );
    });
    setFilteredClientes(filtered);
  };

  const handleNameChange = (event) => {
    setEditingClient({
      ...editingClient,
      nombre: event.target.value,
    });
  };

  const handleRucChange = (event) => {
    setEditingClient({
      ...editingClient,
      ruc: event.target.value,
    });
  };

  const handleTelefonoChange = (event) => {
    setEditingClient({
      ...editingClient,
      telefono: event.target.value,
    });
  };

  const handleEmailChange = (event) => {
    setEditingClient({
      ...editingClient,
      email: event.target.value,
    });
  };

  const handleDireccionChange = (event) => {
    setEditingClient({
      ...editingClient,
      direccion: event.target.value,
    });
  };

  // Funcion para abrir el modal cuando se hace clic en "Editar Cliente"
  const handleEditClientClick = (client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  // Funcion para cerrar el modal
  const handleCloseModal = () => {
    
    setModalOpen(false);
  };



  const handleCloseModalRegistre = () => {
    {
      // Restablecer los datos del cliente
      setClienteDataExtra({ apellido: "" });
      setClienteData({
        nombre: "",
        apellido: "",
        ruc: "",
        cedula: "",
        telefono: "",
        email: "",
        direccion: "",
      });
    }
    setShowModal(false);
  };
  // Funcion para guardar los cambios realizados en el cliente
  const handleGuardarCambios = async () => {
    try {
      await api.put(`/clientes/${editingClient.id}`, editingClient); // Actualiza el cliente con los datos editados
      setModalOpen(false); // Cierra el modal
      fetchClientes();
      toast.success("Usuario editado satisfactoriamente");
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      toast.error("Error al actualizar cliente ");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar si algún campo esta vacios
    const camposObligatorios = ["nombre", "apellido", "ruc"];
    for (const campo of camposObligatorios) {
      if (!clienteData[campo] && !clienteDataExtra.apellido) { // Verificar si el campo está vacío
        toast.error(`El campo ${campo} es obligatorio`);
        return;
      }
    }
    // Verificar la validez del correo si se proporciona
    if (clienteData.email && clienteData.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clienteData.email)) {
        toast.error("Correo electrónico inválido");
        return;
      }
    }

    // Verificar la longitud del número de teléfono si se proporciona
    if (clienteData.telefono && clienteData.telefono.trim() !== "") {
      if (clienteData.telefono.length < 8) {
        toast.error("El número de teléfono debe tener al menos 8 dígitos");
        return;
      }
    }

    setLoading(true);

    // Concatenar el apellido al nombre completo antes de enviar los datos
    const nombreCompleto = `${clienteData.nombre} ${clienteDataExtra.apellido}`;
    const datosCliente = { ...clienteData, nombre: nombreCompleto };

    try {
      const response = await api.post(`/clientes`, datosCliente);
      console.log("Cliente agregado:", response.data);
      toast.success("Cliente guardado exitosamente");
      fetchClientes();
      setClienteDataExtra({ apellido: "" });
      setClienteData({
        nombre: "",
        apellido: "",
        ruc: "",
        cedula: "",
        telefono: "",
        email: "",
        direccion: "",
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      toast.error("Error al registrar cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Verificar si el campo es 'telefono' y si el valor contiene solo numeros
    if (name === "telefono" && /[^0-9]/.test(value)) {
      return;
    }

    if (name === "ruc") {
      let cedulaValue = "";
      if (value.length > 7) {
        cedulaValue = value.slice(0, 7); //los primeros 7 caracteres del RUC
      } else {
        cedulaValue = value; // Si el RUC tiene menos de 7 caracteres toma el valor completo
      }
      setClienteData({
        ...clienteData,
        [name]: value,
        cedula: cedulaValue,
      });
    } else if (name === "telefono" && value.trim() === "") { // Si el campo es el teléfono y se elimina todo el contenido
      setClienteData({
        ...clienteData,
        [name]: "", // Vaciar el campo de teléfono
      });
    }else {
      // Si no es 'ruc', actualiza normalmente
      setClienteData({
        ...clienteData,
        [name]: value,
      });
    }
  };
  const handleApellidoChange = (e) => {
    setClienteDataExtra({
      ...clienteDataExtra,
      apellido: e.target.value,
    });
  };

  const handleConfirmDelete = async () => {
    if (clientToDelete) {
      try {
        await handleDeleteCliente(clientToDelete.id);
        setShowAlert(false);
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        toast.error("Error al eliminar cliente" + error);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowAlert(false); // Oculta la alerta
  };

  // funcion para cancelar la eliminación del cliente
  const handleDeleteCliente = async (id) => {
    setShowAlert(false);
    try {
      await api.delete(`/clientes/${id}`);
      // Vuelve a cargar la lista de clientes despues de eliminar uno
      toast.success("El cliente se elimino con exito");
      fetchClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      toast.error("Error al eliminar cliente");
    }
  };

  const handleShowAlert = (client) => {
    setClientToDelete(client);
    setShowAlert(true);
  };

  //suscripcion

  const fetchActividades = async () => {
    try {
      const response = await api.get(`actividades/page/${actividadesPage}`);
      const actividadesData = response.data.items.map((actividad) => ({
        id: actividad.id,
        nombre: actividad.nombre,
        costoMensual: actividad.costoMensual,
        costoSemanal: actividad.costoSemanal,
      }));
      setActividades(actividadesData);
    } catch (error) {
      console.error("No hay actividades en la lista", error);
      toast.error("No hay actividades en la lista");
    }
  };

  const handleSuscripcionModalOpen = (client) => {
    setSelectedClienteId(client);
    setSuscripcionModalOpen(true);

    setLoadingActividades(true);
    fetchActividades(); //actualizar actividades
  };

  const handleSuscripcionModalClose = () => {
    setSuscripcionModalOpen(false);
    setModalidad("");
    setFechaInicio("");
    setSelectedActivities([]);
  };

  const handleAddSelectedActivity = (activityId) => {
    const activityToAdd = actividades.find(
      (actividad) => actividad.id === parseInt(activityId)
    );
    setSelectedActivities([...selectedActivities, activityToAdd]);
  };

  const handleRemoveSelectedActivity = (activityToRemove) => {
    const updatedSelectedActivities = selectedActivities.filter(
      (activity) => activity.id !== activityToRemove.id
    );
    setSelectedActivities(updatedSelectedActivities);
  };

  const handleSubmitSuscripcion = async (event) => {
    event.preventDefault();

    // Validación de campos faltantes
    if (selectedActivities.length === 0) {
      toast.error("Falta llenar campos. Selecciona al menos una actividad.");
      return;
    }

    if (!fechaInicio) {
      toast.error("Falta llenar campos. Ingresa una fecha de inicio.");
      return;
    }

    let total = 0;
    let daysToAdd = 0;

    if (modalidad === "MENSUAL") {
      daysToAdd = 30;
    } else if (modalidad === "SEMANAL") {
      daysToAdd = 7;
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysToAdd);

    try {
      const suscripcionesData = selectedActivities.map((activity) => ({
        clienteId: selectedClienteId.id,
        actividadId: activity.id,
        modalidad: modalidad,
        estado: "PENDIENTE",
        fechaInicio: fechaInicio,
      }));

      const response = await api.post("/suscripciones", suscripcionesData);
      console.log("Suscripciones agregadas:", response.data);
      toast.success("Suscripciones agregadas exitosamente");
      setSuscripcionModalOpen(false);
      setSuscripcionSuccess(true);
      setSuscripcionError(false);
      // Restablecer los valores
      setModalidad("");
      setFechaInicio("");
      setSelectedActivities([]);
    } catch (error) {
      if (error.response) {
        // El servidor ha respondido con un estado de error
        if (error.response.status === 500) {
          toast.error("El cliente ya posee esa actividad.");
        } else {
          console.error(
            "Error en la respuesta del servidor:",
            error.response.data
          );
          toast.error(
            "Error en la respuesta del servidor. Consulta la consola para más detalles."
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

      setSuscripcionSuccess(false);
      setSuscripcionError(true);
    }
  };

  //estado de filtro
  const handleFiltrar = (filtro) => {
    setFiltro(filtro);
  };

  const handleSearchChange = () => {
    if (searchTerm.length >= 4) {
      searchClientes(searchTerm); // Utiliza searchTerm en lugar de term
    } else {
      setFilteredClientes(clientes);
      // Siempre vuelve a la primera página cuando se borra el término de búsqueda
      setCurrentPage(1);
    }
  };

  const handleInputChanges = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term === "") {
      // Si el input está vacío, vuelve a la primera página
      setCurrentPage(1);
      setFilteredClientes(clientes);
    }
  };

  return (
    <div className="MaquetaCliente">
      <div class="card">
        <div class="container">
        <div className="card-1">
        <h2>Clientes</h2>
        <div className="card-body d-flex align-items-center ">
        <form className="d-flex flex-grow-1 align-items-center">
            <input
              id="input-search"
              className="form-control custom-input"
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleInputChanges}
            />
            <ButtonBasic
              id="btn-Buscar"
              text="Buscar"
              onClick={handleSearchChange}
            />
             </form>
            <div className="dropdown">
              <button
                id="btn-Filtrar"
                type="button"
                className="btn btn-primary dropdown-toggle btn-filtrar"
                data-bs-toggle="dropdown"
              >
                Filtrar por
              </button>
              <ul className="dropdown-menu">
                <li>
                <button
                    className="dropdown-item"
                    id="btn-pagado"
                    onClick={() => handleFiltrar("PAGADO")}
                  >
                    Pagado
                    </button>
                </li>
                <li>
                <button
                    className="dropdown-item"
                    id="btn-pendiente"
                    onClick={() => handleFiltrar("PENDIENTE")}
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
            id="btn-crear"
            text="Nuevo Cliente"
            onClick={() => setShowModal(true)}
               icon={<IoAdd />}
               color="secondary"
            />
          </div>
        </div>
          {/* Modal para registrar nuevo cliente */}
      <ModalBase
        open={showModal}
        closeModal={handleCloseModalRegistre}
        title="Registro de Cliente"
      >
        <div>
          <div
            className="modal-body"
            style={{ marginTop: "0px", paddingTop: "0px" }}
          >
            <p style={{ fontWeight: "bold", fontSize: "14px" }}>
              Datos Personales
            </p>

            <form>
              <div>
                <div className="label-container">
                  <LabelBase label="Nombre:" htmlFor="nombre" />
                  <span className="required">*</span>
                </div>
                <input
                  style={{ width: "100%", height: "30px" }}
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={clienteData.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <div className="label-container">
                  <LabelBase label="Apellido:" htmlFor="apellido" />
                  <span className="required">*</span>
                </div>

                <input
                  type="text"
                  style={{ width: "100%", height: "30px" }}
                  id="apellido"
                  name="apellido"
                  className="form-control"
                  value={clienteDataExtra.apellido}
                  onChange={handleApellidoChange}
                />
              </div>
              <div className="d-flex">
                <div style={{ margin: "5px" }}>
                  <div className="label-container">
                    <LabelBase label="CI/RUC:" htmlFor="ruc" />
                    <span className="required">*</span>
                  </div>

                  <input
                    type="text"
                    style={{ width: "100%", height: "30px" }}
                    id="ruc"
                    name="ruc"
                    className="form-control"
                    value={clienteData.ruc}
                    onChange={handleInputChange}
                  />
                </div>
                <div style={{ margin: "5px" }}>
                  <LabelBase label="Telefono:" htmlFor="telefono" />
                  <input
                    type="text"
                    style={{ width: "100%", height: "30px" }}
                    id="telefono"
                    name="telefono"
                    className="form-control"
                    value={clienteData.telefono}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <LabelBase label="e-mail:" htmlFor="email" />
                <input
                  type="text"
                  style={{ width: "100%", height: "30px" }}
                  id="email"
                  name="email"
                  className="form-control"
                  value={clienteData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <LabelBase label="Dirección:" htmlFor="direccion" />
                <input
                  type="text"
                  style={{ width: "100%", height: "30px" }}
                  id="direccion"
                  name="direccion"
                  className="form-control"
                  value={clienteData.direccion}
                  onChange={handleInputChange}
                />
              </div>
              <div className="campo-obligatorio">
                <span className="required">*</span>
                <span className="message">Campo obligatorio</span>
              </div>
              <div className="d-flex justify-content-center align-items-center float-end">
                <ButtonBasic
                  id="btn-guardar"
                  text="Guardar"
                  onClick={handleSubmit}
                >
                  {loading ? "Cargando..." : "Agregar Cliente"}
                </ButtonBasic>
              </div>
            </form>
          </div>
        </div>
      </ModalBase>
      {/*modal para editar cliente*/}
      <ModalBase
        open={modalOpen}
        title="Editar Cliente"
        closeModal={handleCloseModal}
      >
        <div>
          <div
            className="modal-body"
            style={{ marginTop: "0px", paddingTop: "0px" }}
          >
            <p style={{ fontWeight: "bold", fontSize: "14px" }}>
              Datos Personales
            </p>

            <form>
              <div>
                <LabelBase label="Nombre:" htmlFor="nombre" />
                <input
                  style={{ width: "100%", height: "30px" }}
                  type="text"
                  id="nombreEdit"
                  name="nombre"
                  className="form-control"
                  value={editingClient ? editingClient.nombre : ""}
                  onChange={handleNameChange}
                />
              </div>
              <div className="d-flex">
                <div style={{ margin: "5px" }}>
                  <LabelBase label="CI/RUC:" htmlFor="ruc" />
                  <input
                    type="text"
                    style={{ width: "100%", height: "30px" }}
                    id="rucEdit"
                    name="ruc"
                    className="form-control"
                    value={editingClient ? editingClient.ruc : ""}
                    onChange={handleRucChange}
                  />
                </div>
                <div style={{ margin: "5px" }}>
                  <LabelBase label="Telefono:" htmlFor="telefono" />
                  <input
                    type="text"
                    style={{ width: "100%", height: "30px" }}
                    id="telefonoEdit"
                    name="telefono"
                    className="form-control"
                    value={editingClient ? editingClient.telefono : ""}
                    onChange={handleTelefonoChange}
                  />
                </div>
              </div>
              <div>
                <LabelBase label="e-mail:" htmlFor="email" />
                <input
                  type="text"
                  style={{ width: "100%", height: "30px" }}
                  id="emailEdit"
                  name="email"
                  className="form-control"
                  value={editingClient ? editingClient.email : ""}
                  onChange={handleEmailChange}
                />
              </div>
              <div>
                <LabelBase label="Dirección:" htmlFor="direccion" />
                <input
                  type="text"
                  style={{ width: "100%", height: "30px" }}
                  id="direccionEdit"
                  name="direccion"
                  className="form-control"
                  value={editingClient ? editingClient.direccion : ""}
                  onChange={handleDireccionChange}
                />
              </div>
              <div className="d-flex justify-content-center align-items-center float-end">
                <ButtonBasic
                  text="Guardar"
                  ButtonBasic
                  id="btn-guardarEdit"
                  onClick={handleGuardarCambios}
                >
                  {loading ? "Cargando..." : "Guardar Cambios"}
                </ButtonBasic>
              </div>
            </form>
          </div>
        </div>
      </ModalBase>

      {/* Modal de suscripciones */}
      <ModalBase
        open={suscripcionModalOpen}
        closeModal={handleSuscripcionModalClose}
        title={
          selectedClienteId
            ? `Agregar Suscripción a ${selectedClienteId.nombre}`
            : "Agregar Suscripción"
        }
        total={total}
      >
        <form onSubmit={handleSubmitSuscripcion}>
          <div>
            <div className="label-container">
              <LabelBase label="Modalidad de membresia:" htmlFor="modalidad" />

              <span className="required">*</span>
            </div>
            <select
              className="select"
              value={modalidad}
              id="modalidad"
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
              className="select-activity"
              type="date"
              id="fecha"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div>
            <div className="label-container">
              <LabelBase label="Actividades" htmlFor="actividades" />
              <span className="required">*</span>
            </div>
            <select
              className="select"
              value=""
              id="actividades"
              onChange={(e) => handleAddSelectedActivity(e.target.value)}
            >
              <option value="" disabled hidden>
                Selecciona una actividad
              </option>
              {actividades.map((actividad) => (
                <option  id ="opcion" key={actividad.id} value={actividad.id}>
                  {actividad.nombre}
                </option>
              ))}
            </select>
            <p>
              {selectedActivities.map((activity) => (
                <div key={activity.id} className="select-activity">
                  {activity.nombre}{" "}
                  <button
                    className="button-activity"
                    id="eliminarActividad"
                    onClick={() => handleRemoveSelectedActivity(activity)}
                  >
                    <IoClose />
                  </button>
                  <br />
                </div>
              ))}
            </p>
          </div>

          <div className="d-flex">
            {/*Para manejar el costo mostrar 50.000 o 390.000 */}
            <LabelBase
              label={`Costo: ${total.toLocaleString()} Gs`}
              htmlFor="costo"
            />
          </div>
          <div className="campo-obligatorio">
            <span className="required">*</span>
            <span className="message">Campo obligatorio</span>
          </div>
          {/* Botón para guardar */}
          <div className="d-flex justify-content-center align-items-center float-end">
            <ButtonBasic
              text="Guardar"
              type="submit"
              id="btn-guardarSuscripcion"
              onClick={handleSubmitSuscripcion}
            >
              {loading ? "Cargando..." : "Guardar Cambios"}
            </ButtonBasic>
          </div>
        </form>
      </ModalBase>

      {showAlert && clientToDelete && (
        <CustomAlert
          message={`¿Estás seguro de eliminar a ${clientToDelete.nombre}?`}
          confirmText="Aceptar"
          cancelText="Cancelar"
          confirmAction={handleConfirmDelete}
          cancelAction={handleCancelDelete}
        />
      )}
  
        <div class="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
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
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td style={{ textAlign: "left" }}>
                    <Link to={`/clientesinfo/${cliente.id}`}>
                      <PiUserCircleLight
                        style={{
                          marginLeft: "1rem",
                          padding: "0px",
                          id: "clienteinfo",
                          fontSize: "25px",
                          background: "#eaecf000",
                        }}
                      />{" "}
                      {cliente.nombre}
                    </Link>
                  </td>
                  <td>{cliente.active ? "Activo" : "Inactivo"}</td>
                  <td>
                    <EstadoPago estado={cliente.estado} />{" "}
                  </td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td className="custom-table2">
                    <a
                    id={`btn-eliminar-cliente-${cliente.id}`}
                      href="#"
                      onClick={() => handleShowAlert(cliente)}
                      style={{ fontSize: "0.8rem" }}
                    >
                      <RiDeleteBinLine />
                    </a>
                    <a
                    id={`btn-editar-cliente-${cliente.id}`}
                      href="#"
                      onClick={() => handleEditClientClick(cliente)}
                      style={{ marginLeft: "1em", fontSize: "0.8rem" }}
                    >
                      <FiEdit2 />
                    </a>
                    <a
                    id={`btn-agregar-suscripcion-${cliente.id}`}
                      href="#"
                      onClick={() => handleSuscripcionModalOpen(cliente)}
                      style={{ marginLeft: "1em", fontSize: "0.8rem" }}
                    >
                      <IoAdd />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        <div className="pagination-container">
          <Pagination
             id="selector-paginacion"
             count={totalPages} // Número total de páginas
             page={currentPage} // Página actual
             onChange={handlePageChange}
          />
        </div>
      </div>
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
    </div>
  );
};

export default MainClients;
