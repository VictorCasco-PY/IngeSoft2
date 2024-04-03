import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MainProveedores.css";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";

import ButtonBasic from "../../components/bottons/ButtonBasic";
import ButtonCrear from "../../components/bottons/ButtonCrear";
import ModalBase from "../../components/modals/ModalBase";
import LabelBase from "../../components/labels/LabelBase";
import CustomAlert from "../../components/alert/CustomAlert";
import { IoCheckmark } from "react-icons/io5";
import api from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import ErrorPagina from "../../components/errores/ErrorPagina";
import Pagination from "../../components/pagination/PaginationContainer";
import ElementoNoEncontrado from "../../components/errores/ElementoNoEncontrado";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";


const MainProveedores = () => {

    const [proveedores, setProveedores] = useState([]);
    const [filteredProveedores, setFilteredProveedores] = useState([]);
    const [proveedorToDelete, setProveedorToDelete] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [modalMode, setModalMode] = useState("create");

    const [searchQuery, setSearchQuery] = useState("");
    // Funciones para filtrado (No implementado)
    const [showAlert, setShowAlert] = useState(false);
    const [searchResultsFound, setSearchResultsFound] = useState(true);
    const [appliedFilter, setAppliedFilter] = useState("nombre");

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [error, setError] = useState(false); // Estado para manejo de errores

    const [proveedorData, setProveedorData] = useState({
        nombre: "",
        ruc: "",
        email: "",
        telefono: "",
        direccion: ""
    });

    const [proveedorDataToSend, setProveedorDataToSend] = useState({
        nombre: "",
        ruc: "",
        email: "",
        telefono: "",
        direccion: ""
    });

    useEffect(() => {
        fetchProveedores(currentPage);
    }, [currentPage]);

    const fetchProveedores = async (page) => {
        try {
            const response = await api.get(`/proveedores/page/${page}`);
            console.log(response.data.items);
            setProveedores(response.data.items);
            setFilteredProveedores(response.data.items);
            setTotalPages(response.data.totalPages);
            setError(false);
        } catch (error) {
            setError(true);
            console.error("Error al obtener los proveedores:", error);
        }
    };

    // Funciones para el cambio de pagina por Paginacion
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Aquí podrías realizar otras acciones relacionadas con el cambio de página, como cargar datos adicionales, etc.
    };

    // Funciones para la alerta de borrado
    const handleShowAlert = (proveedor) => {
        setProveedorToDelete(proveedor);
        setShowAlert(true);
    };

    const handleCancelDelete = () => {
        setShowAlert(false); // Oculta la alerta
    };

    const handleEliminarProveedor = async () => {
        if (proveedorToDelete) {
            try {
                await api.delete(`/proveedores/${proveedorToDelete.id}`);

                fetchProveedores(currentPage);
                toast.success("Proveedor eliminado satisfactoriamente");
            } catch (error) {
                console.error("Error al eliminar el proveedor:", error);
                toast.error("Error al eliminar el proveedor");
            }
        }
    };

    const handleConfirmDelete = async () => {
        if (proveedorToDelete) {
            try {
                await handleEliminarProveedor();
                setShowAlert(false);
            } catch (error) {
                console.error("Error al eliminar proveedor:", error);
                toast.error("Error al eliminar proveedor" + error);
            }
        }
    };

    // Funciones para filtrado
    const handleInputChange = (event) => {
        const newSearchQuery = event.target.value;
        setSearchQuery(newSearchQuery);

        if (newSearchQuery === "") {
            // Si el input de búsqueda está vacío, vuelve a la primera página
            setCurrentPage(1);
            setFilteredProveedores(proveedores);
        }
    };

    const handleSearchClick = () => {
        if (appliedFilter === null) {
            toast.error("Seleccione un tipo de filtro");
            return
        }
        if (searchQuery.length >= 4) {
            searchProveedores(searchQuery);
        } else {
            setFilteredProveedores(proveedores);
        }
    };

    //Seccion donde esta la logica de la busqueda
    const searchProveedores = async (term) => {
        try {
            let response;
            if (appliedFilter === "RUC") {
                const responseRUC = await api.get(
                    `/proveedores/searchByRuc/${term}/page/${currentPage}`
                );
                response = responseRUC;
            } else if (appliedFilter === "nombre") {
                const responseNombre = await api.get(
                    `/proveedores/search/${term}/page/${currentPage}`
                );
                response = responseNombre;
            }
            const filtered = response.data.items;
            setFilteredProveedores(filtered);
            setSearchResultsFound(filtered.length > 0); // Si la longitud de 'filtered' es cero, establece 'searchResultsFound' en false
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Mostrar un mensaje de "Producto no encontrado" cuando el servidor devuelve un 404
                setFilteredProveedores([]);
                setSearchResultsFound(false);
            } else {
                setSearchResultsFound(true);
                console.error("Error al buscar proveedores por nombre:", error);
            }
        }
    };

    const handleFilterSelector = (filtro) => {
        setAppliedFilter(filtro);
    };

    // Funciones para el modal
    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setShowEditModal(false);
    };

    const handleEditarProveedor = (proveedor) => {
        setModalMode("edit"); // Establece el modo como editar
        setProveedorData(proveedor); // Establece los datos del proveedor a editar en el estado
        setProveedorDataToSend(proveedor);
        setShowEditModal(true);
    };

    const handleNuevoProveedor = () => {
        setModalMode("create"); // Establece el modo como crear
        setProveedorDataToSend({
            nombre: "",
            ruc: "",
            email: "",
            telefono: "",
            direccion: ""
        });
        setShowModal(true);
    };

    const handleCampoChange = (event) => {
        const { name, value } = event.target;
        // Comprobaciones en tiempo real de ser necesarias
        if (name === "nombre") {
            setProveedorDataToSend((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (name === "ruc") {
            setProveedorDataToSend((prevData) => ({
                ...prevData,
                [name]: value.trim(),
            }));
        } else if (name === "email") {
            setProveedorDataToSend((prevData) => ({
                ...prevData,
                [name]: value.trim(),
            }));
        } else if (name === "telefono") {
            setProveedorDataToSend((prevData) => ({
                ...prevData,
                [name]: value.trim(),
            }));
        } else if (name === "direccion") {
            setProveedorDataToSend((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            // Si el campo no es uno de los anteriores, simplemente actualizar el estado con el valor ingresado
            setProveedorDataToSend((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleAceptar = async () => {
        console.log("PULSADO ACEPTAR");
        try {
            // Validar campos obligatorios
            if (proveedorDataToSend.nombre == "") {
                toast.error("El Nombre es un campo obligatorio.");
                return;
            }

            if (proveedorDataToSend.ruc == "") {
                toast.error("El RUC es un campo obligatorio.");
                return;
            }

            if (proveedorDataToSend.email == "") {
                toast.error("El email es un campo obligatorio.");
                return;
            }

            if (proveedorDataToSend.telefono == "") {
                toast.error("El teléfono es un campo obligatorio.");
                return;
            }

            if (proveedorDataToSend.direccion == "") {
                toast.error("La direccion es un campo obligatorio.");
                return;
            }

            setProveedorDataToSend((prevData) => ({
                ...prevData,
                nombre: proveedorDataToSend.nombre.trim(),
                direccion: proveedorDataToSend.direccion == "" ? proveedorDataToSend.direccion.trim() : ""
            }));


            // Validar el formato del RUC
            const rucRegex = /^[0-9]{6,8}[A-Z]?(-[0-9])?$/;
            if (!rucRegex.test(proveedorDataToSend.ruc)) {
                toast.error("RUC inválido.");
                return;
            }

            // Validar el formato del RUC
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (proveedorDataToSend.email != "") {
                if (!emailRegex.test(proveedorDataToSend.email)) {
                    toast.error("Correo electrónico inválido");
                    return;
                }
            }

            //
            const telefonoRegex = /^\+?[0-9]{8,}$/
            if (proveedorDataToSend.telefono != "") {
                if (!telefonoRegex.test(proveedorDataToSend.telefono)) {
                    toast.error("Número de teléfono inválido");
                    return;
                }
            }

            let response;
            if (modalMode === "create") {
                console.log(proveedorDataToSend);
                response = await api.post("/proveedores", proveedorDataToSend);
                console.log("Proveedor creado:", response.data);
                toast.success("Proveedor creado satisfactoriamente");
            } else if (modalMode === "edit") {
                // Verificar si se realizaron cambios
                let sonIguales = true;
                const clavesOriginal = Object.keys(proveedorData);

                // Iteramos sobre las claves de uno de los objetos
                for (let clave of clavesOriginal) {
                    // Verificamos si los valores de las claves son iguales en ambos objetos
                    if (proveedorData[clave] !== proveedorDataToSend[clave]) {
                        sonIguales = false;
                    }
                }
                if (sonIguales) {
                    toast.error("No se realizó ningún cambio en el proveedor");
                    return
                }

                response = await api.put(`/proveedores/${proveedorDataToSend.id}`, proveedorDataToSend);
                console.log("Proveedor editado:", response.data);
                toast.success("Proveedor actualizado satisfactoriamente");
            }

            setShowModal(false);
            setShowEditModal(false);
            fetchProveedores(currentPage);
        } catch (error) {
            console.error("Error al procesar la solicitud:", error);
            toast.error("Error al procesar la solicitud");
        }
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
                    <h1>Proveedores</h1>
                    <div className="card-body d-flex align-items-center ">
                        <form className="d-flex flex-grow-1 align-items-center">
                            <input
                                id="input-search"
                                className="form-control custom-input"
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={handleInputChange}
                            />
                            <ButtonBasic
                                id="btn-buscar"
                                text="Buscar"
                                onClick={handleSearchClick}
                            />
                        </form>
                        <div className="dropdown">
                            <button
                                id="btn-filtrar"
                                type="button"
                                className="btn btn-primary dropdown-toggle btn-filtrar"
                                data-bs-toggle="dropdown"
                            >
                                <IoCheckmark />
                                {appliedFilter ? `Filtrado por ${appliedFilter}` : "Filtrar por..."}
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <a className="dropdown-item" href="#"
                                        id="nombre-filtro"
                                        onClick={() => handleFilterSelector("nombre")}>
                                        Nombre
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#"
                                        id="ruc-filtro"
                                        onClick={() => handleFilterSelector("RUC")}>
                                        RUC
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <ButtonCrear
                            id="btn-crear"
                            text="Nuevo Proveedor"
                            onClick={handleNuevoProveedor}
                            icon={<IoAdd />}
                            color="secondary"
                        />
                    </div>
                </div>
                <ModalBase
                    open={showModal || showEditModal}
                    closeModal={handleCloseModal}
                    title={showModal ? "Crear Nuevo Proveedor" : "Editar Proveedor"}
                >
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
                                value={proveedorDataToSend.nombre}
                                onChange={handleCampoChange}
                                required
                            />
                        </div>
                        <div className="mb-2 block">
                            <div className="label-container">
                                <LabelBase label="Ruc:" htmlFor="ruc" />
                                <span className="required">*</span>
                            </div>
                            <input
                                type="text"
                                id="ruc"
                                name="ruc"
                                className="form-control"
                                value={proveedorDataToSend.ruc}
                                onChange={handleCampoChange}
                                required
                            ></input>
                        </div>
                        <div className="mb-2 block">
                            <div className="label-container">
                                <LabelBase label="Email:" htmlFor="email" />
                                <span className="required">*</span>
                            </div>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                className="form-control"
                                value={proveedorDataToSend.email}
                                onChange={handleCampoChange}
                            ></input>
                        </div>
                        <div className="mb-2 block">
                            <div className="label-container">
                                <LabelBase label="Teléfono:" htmlFor="telefono" />
                                <span className="required">*</span>
                            </div>
                            <input
                                type="text"
                                id="telefono"
                                name="telefono"
                                className="form-control"
                                value={proveedorDataToSend.telefono}
                                onChange={handleCampoChange}
                            ></input>
                        </div>
                        <div className="mb-2 block">
                            <div className="label-container">
                                <LabelBase label="Dirección:" htmlFor="direccion" />
                                <span className="required">*</span>
                            </div>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                className="form-control"
                                value={proveedorDataToSend.direccion}
                                onChange={handleCampoChange}
                            ></input>
                        </div>
                        <div className="campo-obligatorio">
                            <span className="required">*</span>
                            <span className="message">Campo obligatorio</span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center float-end">
                            <ButtonCrear
                                id="btn-guardar"
                                text="Aceptar"
                                onClick={() => handleAceptar()}
                            />
                        </div>
                    </form>
                </ModalBase>
                {showAlert && proveedorToDelete && (
                    <CustomAlert
                        message={`¿Estás seguro de eliminar el proveedor ${proveedorToDelete.nombre}?`}
                        id="alerta-personalizada"
                        confirmText="Aceptar"
                        cancelText="Cancelar"
                        confirmAction={handleConfirmDelete}
                        cancelAction={handleCancelDelete}
                    />
                )}
                <div class="table-container">
                    {error && <ErrorPagina />}{" "}
                    {/* Muestra el componente de error si hay un error */}
                    {!error &&
                        filteredProveedores.length === 0 &&
                        !searchResultsFound && (
                            <ElementoNoEncontrado mensaje="Proveedor no encontrado!" />
                        )}
                    {!error && filteredProveedores.length > 0 && (
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre del Proveedor</th>
                                    <th scope="col">
                                        RUC
                                    </th>
                                    <th scope="col">
                                        Email
                                    </th>
                                    <th scope="col">Número de Teléfono</th>
                                    <th scope="col">Dirección</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProveedores.map((proveedor) => (
                                    <tr key={proveedor.id}>
                                        <td>{proveedor.nombre}</td>
                                        <td>{proveedor.ruc}</td>
                                        <td>{proveedor.email}</td>
                                        <td>{proveedor.telefono}</td>
                                        <td>{proveedor.direccion}</td>
                                        <td class="text-center">
                                            <a
                                                href="#"
                                                id={`btn-eliminar-proveedor-${proveedor.id}`}
                                                onClick={() => handleShowAlert(proveedor)}
                                                style={{ fontSize: "1.2rem" }}
                                            >
                                                <RiDeleteBinLine />
                                            </a>
                                            <a
                                                href="#"
                                                id={`btn-editar-proveedor-${proveedor.id}`}
                                                onClick={() => handleEditarProveedor(proveedor)}
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
                    <Pagination
                        id="selector-paginacion"
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </CartaPrincipal>
        </>
    );
};

export default MainProveedores;