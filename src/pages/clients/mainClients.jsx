/** */
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
import { Button } from "flowbite-react";
import { IoAddOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import EstadoPago from "../../components/estado_pago/EstadoPago";


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
    fetchActividades();
  }, []);

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
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      toast.error("Error al actualizar cliente ");
    }
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.length >= 4) {
      searchClientes(term);
    } else {
      setFilteredClientes(clientes);
      // Siempre vuelve a la primera página cuando se borra el término de búsqueda
      setCurrentPage(1);
    }
  };

  const searchClientes = (term) => {
    const filtered = clientes.filter((cliente) => {
      const nombre = cliente.nombre.toLowerCase();
      const email = cliente.email.toLowerCase();
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

    // Verificar si algún campo esta vacio
    for (const key in clienteData) {
      if (clienteData[key] === "") {
        toast.error(`El campo ${key} no puede estar vacío`);
        return;
      }
    }

    // Verificar la validez del correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clienteData.email)) {
      toast.error("Correo electrónico inválido");
      return;
    }

    // Verificar la longitud del numero de teléfono
    if (clienteData.telefono.length < 8) {
      toast.error("El número de teléfono debe tener al menos 8 dígitos");
      return;
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
    if (name === "telefono" && !/^\d+$/.test(value)) {
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
    } else {
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
      const response = await api.get(
        "http://localhost:8080/actividades/page/1"
      );
      const actividadesData = response.data.items.map((actividad) => ({
        id: actividad.id,
        nombre: actividad.nombre,
        costoMensual: actividad.costoMensual,
        costoSemanal: actividad.costoSemanal,
      }));
      setActividades(actividadesData);
    } catch (error) {
      console.error("Error al obtener actividades:", error);
      toast.error("Error al obtener actividades");
    }
  };

  const handleSuscripcionModalOpen = (client) => {
    setSelectedClienteId(client);
    setSuscripcionModalOpen(true);
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
  

  return (
    <div className="MaquetaCliente">
      <div className="cuadro-central">
        <h2>Clientes</h2>
        <div className="header-cliente">
          <div className="header-Principal">
            <input
              type="text"
              placeholder="Buscar..."
              className="form-control me-2"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <ButtonBasic text="Buscar" onClick={handleSearchChange} />
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
      <button className="dropdown-item"  id="Btnpagado" onClick={() => handleFiltrar("PAGADO")}>
        Pagado
      </button>
    </li>
    <li>
      <button className="dropdown-item"  id="BtnPendiente" onClick={() => handleFiltrar("PENDIENTE")}>
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
            <button className="button" onClick={() => setShowModal(true)}>
              <IoAdd />
              Nuevo Cliente
            </button>
          </div>
        </div>
        <hr />
        <div className="tabla">
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
            <tbody className="table tbody tr:nth-child(odd) ">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>
                    <Link to={`/clientesinfo/${cliente.id}`}>
                      <PiUserCircleLight
                        style={{
                          padding: "0px",
                          fontSize: "25px",
                          background: "#eaecf000",
                        }}
                      />{" "}
                      {cliente.nombre}
                    </Link>
                  </td>
                  <td className=".custom-table2">
                    {cliente.active ? "Activo" : "Inactivo"}
                  </td>
                  <td className=".custom-table2"><EstadoPago estado={cliente.estado}/> </td>
                  <td className="custom-table2">{cliente.email}</td>
                  <td className="custom-table2">{cliente.telefono}</td>
                  <td className="custom-table2">
                    <a href="#" onClick={() => handleShowAlert(cliente)}>
                      <RiDeleteBinLine />
                    </a>
                    <a href="#" onClick={() => handleEditClientClick(cliente)}>
                      <FiEdit2 />
                    </a>
                    <a
                      href="#"
                      onClick={() => handleSuscripcionModalOpen(cliente)}
                    >
                      <IoAdd />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            count={Math.ceil(filteredClientes.length / itemsPerPage)}
            page={currentPage <= 2 ? currentPage : 1}
            onChange={(event, value) => setCurrentPage(value)}
            shape="rounded"
            color="secondary"
          />
        </div>
      </div>
      {/* Modal para registrar nuevo cliente */}
      <ModalBase
        open={showModal}
        closeModal={() => setShowModal(false)}
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
                <ButtonBasic text="Guardar" onClick={handleSubmit}>
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
                  id="nombre"
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
                    id="ruc"
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
                    id="telefono"
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
                  id="email"
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
                  id="direccion"
                  name="direccion"
                  className="form-control"
                  value={editingClient ? editingClient.direccion : ""}
                  onChange={handleDireccionChange}
                />
              </div>
              <div className="d-flex justify-content-center align-items-center float-end">
                <ButtonBasic text="Guardar" onClick={handleGuardarCambios}>
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
              onChange={(e) => handleAddSelectedActivity(e.target.value)}
            >
              <option value="" disabled hidden>
                Selecciona una actividad
              </option>
              {actividades.map((actividad) => (
                <option key={actividad.id} value={actividad.id}>
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
  <LabelBase label={`Costo: ${total.toLocaleString()}`} htmlFor="costo" />
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

      <div className="d-flex justify-content-center mt-4">
        <div className="pagination-container"></div>
      </div>
    </div>
  );
};

export default MainClients;
