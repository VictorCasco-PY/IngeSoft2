import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./mainUsers.css";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { IoCheckmark } from "react-icons/io5";
import { TbArrowDown } from "react-icons/tb";
import { GoQuestion } from "react-icons/go";
import api from "../../utils/api";
import LabelBase from "../../components/labels/LabelBase";
import ModalBase from "../../components/modals/ModalBase";
import ButtonBasic from "../../components/bottons/ButtonBasic";
import CustomAlert from "../../components/alert/CustomAlert";
import ErrorPagina from "../../components/errores/ErrorPagina";
import Pagination from "../../components/pagination/PaginationContainer";
import ElementoNoEncontrado from "../../components/errores/ElementoNoEncontrado";
import toast, { Toaster } from "react-hot-toast";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";

export let filteredUsers;
export let handleShowAlert;
export let handleEditarUsuario;
export let searchResultsFound;
export let fetchUsers;
const MainUsers = () => {
  const emptyUser = {
    nombre: "",
    cedula: "",
    telefono: "",
    direccion: "",
    email: "",
    rol: null,
  };
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [searchResultsFound, setSearchResultsFound] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const nameRegex = /^[a-zA-ZÁáÉéÍíÓóÚúÑñ ]{2,}$/;
  const cedulaRegex = /^[0-9A-Za-z]+$/;
  const telefonoRegex = /^\d+$/;
  const direccionRegex = /^[\w\sáéíóúÁÉÍÓÚñÑ.,#'\-\+&ª]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [error, setError] = useState(false);

  const [userData, setUserData] = useState(emptyUser);
  const roles = [
    { label: "rol", value: null },
    { label: "admin", value: 1 },
    { label: "cajero", value: 3 },
    { label: "entrenador", value: 4 },
  ];

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const getRoleName = (id) => {
    if (id === 1) return "Administrador";
    if (id === 3) return "Cajero";
    if (id === 4) return "Entrenador";
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchUsers = async (page) => {
    try {
      const response = await api.get(`/empleados/page/${page}`);
      setUsers(response.data.items);
      setFilteredUsers(response.data.items);
      filterUsersByRole(selectedRole, response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      // ver si mantener o borrar una vez que se resuelva el problema de la api
      setUsers([]);
      setFilteredUsers([]);
      filterUsersByRole(selectedRole, []);
      setTotalPages(1);
      //setError(true);
      console.error("Error al obtener los usuarios:", error);
    }
  };
  const filterUsersByRole = (role, usersList) => {
    if (role === null) {
      setFilteredUsers(usersList);
    } else {
      const filtered = usersList.filter((user) => user.rol === role);
      setFilteredUsers(filtered);
    }
  };

  const searchUsuarios = async (term) => {
    try {
      const response = await api.get(
        `/empleados/search/${term}/page/${currentPage}`
      );
      const filtered = response.data.items;
      setFilteredUsers(filtered);
      setSearchResultsFound(filtered.length > 0); // Si la longitud de 'filtered' es cero, establece 'searchResultsFound' en true
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Mostrar un mensaje de "Usuario no encontrado" cuando el servidor devuelve un 404
        setFilteredUsers([]); // Establecer los usuarios filtrados como vacíos
        setSearchResultsFound(false); // Indicar que no se encontraron resultados
      } else {
        // Manejar otros errores de manera similar a como lo haces actualmente
        setSearchResultsFound(true);
        console.error("Error al buscar usuario por nombre:", error);
      }
    }
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.length >= 4) {
      searchClientes(term);
    } else {
      filterUsersByRole(selectedRole, users);
      //setFilteredUsers(users);
      // Siempre vuelve a la primera página cuando se borra el término de búsqueda
      setCurrentPage(1);
    }
  };
  const xClientes = (term) => {
    const filtered = users.filter((user) => {
      const nombre = user.nombre.toLowerCase();
      const email = user.email.toLowerCase();

      return (
        nombre.includes(term.toLowerCase()) ||
        email.includes(term.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
  };

  //Buscar una mejor implementacion
  const rolByID = (id) => {
    if (id === 1) {
      return "Admin";
    } else if (id === 3) {
      return "Cajero";
    } else if (id === 4) {
      return "Entrenador";
    } else {
      return "Rol Invalido";
    }
  };
  // Funcion para guardar los cambios realizados en el cliente
  // Pendiente a la API

  const handleEditarUsuario = (usuario) => {
    setModalMode("edit"); // Establece el modo como editar
    setUserData(usuario); // Establece los datos del user a editar en el estado
    setShowEditModal(true);
  };

  const handleRoleChange = async (roleValue) => {
    try {
      const response = await api.get(
        `/empleados/searchByRol/${roleValue}/page/${currentPage}`
      );
      console.log(response.items);
      setSelectedRole(roleValue);

      setFilteredUsers(response.data.items);
    } catch (error) {
      // ver si mantener o borrar una vez que se resuelva el problema de la api
      setUsers([]);
      setFilteredUsers([]);
      filterUsersByRole(selectedRole, []);
      setTotalPages(1);
      //setError(true);
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const handleSearchClick = () => {
    searchUsuarios(searchTerm);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    setUserData(emptyUser);
  };
  const handleAceptar = async () => {
    try {
      if (modalMode === "create") {
        // Validación de Nombre
        const nombreExists = users.some(
          (user) => user.nombre.toLowerCase() === userData.nombre.toLowerCase()
        );
        if (nombreExists) {
          toast.error("El nombre del usuario ya existe.");
          return;
        }
        if (userData.nombre.length < 2) {
          toast.error("El nombre debe tener al menos 2 caracteres.");
          return;
        }
        if (!nameRegex.test(userData.nombre)) {
          toast.error(
            "El nombre no puede contener caracteres especiales o números"
          );
          return;
        }

        const cedulaExists = users.some(
          (user) => user.cedula.toLowerCase() === userData.cedula.toLowerCase()
        );
        if (cedulaExists) {
          toast.error("La cedula del user ya está en uso.");
          return;
        }
        if (!cedulaRegex.test(userData.cedula)) {
          toast.error(
            "El número de cedula solo puede contener números y letra"
          );
        }
        if (userData.cedula.length > 9) {
          toast.error("El numero de cédula no debe más de 9 caracteres.");
          return;
        }
        const telefonoExists = users.some(
          (user) =>
            user.telefono.toLowerCase() === userData.telefono.toLowerCase()
        );
        if (!telefonoRegex.test(userData.telefono)) {
          toast.error("El teléfono solo puede contener números.");
          return;
        }
        if (userData.telefono.length < 7 || userData.telefono.length > 12) {
          toast.error("El teléfono debe tener entre 7 y 12 caracteres.");
          return;
        }
        const direccionExists = users.some(
          (user) =>
            user.direccion.toLowerCase() === userData.direccion.toLowerCase()
        );
        if (!direccionRegex.test(userData.direccion)) {
          toast.error(
            "La dirección solo puede contener letras, números y espacios."
          );
          return;
        }
        if (userData.direccion.length < 5) {
          toast.error("La dirección debe tener al menos 5 caracteres.");
          return;
        }
        const emailExists = users.some(
          (user) => user.email.toLowerCase() === userData.email.toLowerCase()
        );
        if (!emailRegex.test(userData.email)) {
          toast.error("El email no es válido.");
          return;
        }
        if (!userData.email.includes('@')) {
          toast.error("El email debe contener el símbolo '@'.");
          return;
        }
        if (userData.email.length > 50) {
          toast.error("El email no debe tener más de 50 caracteres.");
          return;
        }
      }

      let response;
      if (modalMode === "create") {
        response = await api.post("/empleados", userData);
        console.log("Usuario creado:", response.data);
        toast.success("Usuario creado satisfactoriamente");
        setFilteredUsers([...filteredUsers, response.data]);
      } else if (modalMode === "edit") {
        // Verificar si se realizaron cambios
        const editedUsuarios = users.find((user) => user.id === userData.id);
        if (
          editedUsuarios.nombre === userData.nombre &&
          editedUsuarios.cedula === userData.cedula
        ) {
          toast.promise(new Promise((resolve) => resolve()), {
            loading: "Guardando...",
            success: "No se realizo ningun cambio en el user.",
            error: "Hubo un error al guardar los cambios.",
          });
          return;
        }
        response = await api.put(`/empleados/${userData.id}`, userData);
        console.log("Usuario editado:", response.data);
        toast.success("Usuario actualizado satisfactoriamente");
      }
      setUserData(emptyUser);
      setShowModal(false);
      setShowEditModal(false);
      fetchUsers(currentPage);
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      toast.error("Error al procesar la solicitud");
    }
  };

  const handleInputChan = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm === "") {
      // Si el input de búsqueda está vacío, vuelve a la primera página
      setCurrentPage(1);
      setFilteredUsers(users);
    }
  };

  const handleCloseFilter = () => {
    setFilteredUsers(users);
    setSelectedRole(null);
    setFilterOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Verificar si el campo es 'telefono' y si el valor contiene solo numeros
    if (name === "telefono" && !/^\d*$/.test(value)) {
      return;
    }

    if (name === "ruc") {
      let cedulaValue = "";
      if (value.length > 7) {
        cedulaValue = value.slice(0, 7); //los primeros 7 caracteres del RUC
      } else {
        cedulaValue = value; // Si el RUC tiene menos de 7 caracteres toma el valor completo
      }
      setUserData({
        ...userData,
        [name]: value,
        cedula: cedulaValue,
      });
    } else {
      // Si no es 'ruc', actualiza normalmente
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await handelDeleteUser(userToDelete.id);
        setShowAlert(false);
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        toast.error("Error al eliminar usuario" + error);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowAlert(false); // Oculta la alerta
  };

  //API pendiente
  // funcion para cancelar la eliminación del cliente
  const handelDeleteUser = async (id) => {
    setShowAlert(false);
    try {
      await api.delete(`/empleados/${id}`);
      // Vuelve a cargar la lista de clientes despues de eliminar uno
      toast.success("El usuario se elimino con exito");
      fetchUsers(currentPage);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error("Error al eliminar usuario");
    }
  };
  const handleShowAlert = (user) => {
    setUserToDelete(user);
    setShowAlert(true);
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
          <h1>Usuarios</h1>
          <div className="card-body d-flex align-items-center justify-content-between">
            <form className="d-flex flex-grow-1 align-items-center">
              <input
                id="input-search"
                className="form-control custom-input"
                type="text"
                placeholder="Buscar usuario"
                value={searchTerm}
                onChange={handleInputChan}
              />
              <ButtonBasic text="Buscar" onClick={handleSearchClick} />
            </form>
            <div className="dropdown contenedorFiltro">
              <div>
                <button
                  id="btn-search"
                  type="button"
                  className="btn btn-primary dropdown-toggle btn-filtrar"
                  data-bs-toggle="dropdown"
                >
                  {selectedRole ? getRoleName(selectedRole) : <IoCheckmark />}
                  {selectedRole ? null : "Filtrar por rol..."}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRoleChange(1)}
                    >
                      Administrador
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRoleChange(3)}
                    >
                      Cajero
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRoleChange(4)}
                    >
                      Entrenador
                    </a>
                  </li>
                </ul>
              </div>
              <div className="outFilter">
                {selectedRole && (
                  <button
                    className="btn btn-sm btn-close justify-content-between x"
                    onClick={handleCloseFilter}
                  ></button>
                )}
              </div>
            </div>

            {/* onClick={handleNuevoUsuario} */}
            <button
              id="btn-crearUser"
              className="button-t"
              onClick={() => setShowModal(true)}
            >
              + Nuevo Usuario
            </button>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <ElementoNoEncontrado mensaje="No existen usuarios con ese rol" />
        )}

        <ModalBase
          //Implementacion de Cesar.
          open={showModal || showEditModal}
          closeModal={handleCloseModal}
          title={showModal ? "Crear Nuevo Usuario" : "Editar Usuario"}
          // open={showModal}
          // closeModal={() => setShowModal(false)}
          // title="Registro de Usuario"
        >
          <form className="mb-3">
            <div className="mb-2 block">
              <div className="label-container">
                <LabelBase label="Nombre:" htmlFor="nombre" />
                <span className="required">*</span>
              </div>
              <input
                id="input-name"
                style={{ width: "100%", height: "30px" }}
                type="text"
                name="nombre"
                className="form-control"
                value={userData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="d-flex justify-content-between">
              <div className="row ">
                <div className="col-sm">
                  <div className="label-container">
                    <LabelBase label="Telefono:" htmlFor="telefono" />
                    <span className="required">*</span>
                  </div>
                  <input
                    style={{ width: "100%", height: "30px" }}
                    type="text"
                    id="input-phone"
                    name="telefono"
                    className="form-control"
                    value={userData.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-sm">
                  <div className="label-container">
                    <LabelBase label="Cedula:" htmlFor="cedula" />
                    <span className="required">*</span>
                  </div>
                  <input
                    style={{ width: "100%", height: "30px" }}
                    type="text"
                    id="input-cedula"
                    name="cedula"
                    className="form-control"
                    value={userData.cedula}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mb-2 block">
              <div className="label-container">
                <LabelBase label="Direccion:" htmlFor="direccion" />
                <span className="required">*</span>
              </div>
              <input
                style={{ width: "100%", height: "30px" }}
                type="text"
                id="input-direccion"
                name="direccion"
                className="form-control"
                value={userData.direccion}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-2 block">
              <div className="label-container">
                <LabelBase label="e-mail:" htmlFor="e-mail" />
                <span className="required">*</span>
              </div>
              <input
                type="text"
                style={{ width: "100%", height: "30px" }}
                id="input-email"
                name="email"
                className="form-control"
                value={userData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-2 block">
              <div className="label-container">
                <LabelBase label="Rol:" htmlFor="rol" />
                <span className="required">*</span>
              </div>
              <select
                style={{ width: "100%", height: "40px" }}
                id="rol"
                name="rol"
                className="form-control form-select"
                value={userData.rol}
                onChange={handleInputChange}
              >
                {roles.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo-obligatorio">
              <span className="required">*</span>
              <span className="message">Campo obligatorio</span>
            </div>

            <div className="d-flex justify-content-center align-items-center float-end">
              {/* <ButtonBasic text="Guardar" onClick={handleSubmit}>
                  {loading ? "Cargando..." : "Agregar Usuario"}
                </ButtonBasic> */}
              <ButtonBasic
                id="btn-aceptar"
                text="Aceptar"
                onClick={handleAceptar}
              />
            </div>
          </form>
        </ModalBase>
        {showAlert && userToDelete && (
          <CustomAlert
            message={`¿Estás seguro de eliminar a ${userToDelete.nombre}?`}
            confirmText="Aceptar"
            cancelText="Cancelar"
            confirmAction={handleConfirmDelete}
            cancelAction={handleCancelDelete}
          />
        )}
        <div class="table-container">
          {error && (
            <ErrorPagina
              mensaje=" ¡Ups! Parece que hubo un problema al cargar los usuarios. Por favor,
                          inténtalo de nuevo más tarde."
            />
          )}
          {!error && filteredUsers.length === 0 && !searchResultsFound && (
            <ElementoNoEncontrado mensaje="Usuario no encontrado!" />
          )}
          {!error && filteredUsers.length > 0 && (
            <table className="custom-table">
              <thead>
                <tr>
                  <th scope="col">Nombre del Usuario</th>
                  <th scope="col">
                    Rol <TbArrowDown />
                  </th>
                  <th scope="col">
                    email <GoQuestion />
                  </th>
                  <th scope="col">Telefono</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nombre}</td>
                    <td>
                      <div className="estadoIDUser">{rolByID(user.rol)}</div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.telefono}</td>
                    <td class="text-center">
                      <a
                        id="btn-delete"
                        href="#"
                        onClick={() => handleShowAlert(user)}
                        style={{ fontSize: "1.2rem" }}
                      >
                        <RiDeleteBinLine />
                      </a>
                      <a
                        id="btn-edit"
                        href="#"
                        onClick={() => handleEditarUsuario(user)}
                        style={{ marginLeft: "1.5em", fontSize: "1.2rem" }}
                      >
                        <FiEdit2 />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </CartaPrincipal>
    </>
  );
};
export default MainUsers;
