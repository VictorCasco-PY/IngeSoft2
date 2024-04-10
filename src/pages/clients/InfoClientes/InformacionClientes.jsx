import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../InfoClients.css";

import toast, { Toaster } from "react-hot-toast";
import { useParams, useSearchParams } from "react-router-dom";
import { IoArrowBackSharp, IoAdd } from "react-icons/io5";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { IoPencilOutline } from "react-icons/io5";
import Pagination from "../../../components/pagination/PaginationContainer.jsx";

import ButtonBasic from "../../../components/bottons/ButtonBasic.jsx";

import ModalBase from "../../../components/modals/ModalBase.jsx";

import EstadoPago from "../../../components/estado_pago/EstadoPago.jsx";
import { Link } from "react-router-dom";
import TablaActividadesCliente from "../../../components/tablas/TablaActividadesCliente.jsx";

import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal.jsx";
import FormularioCliente from "../../../components/Formularios/FormularioCliente.jsx";
import FormularioMedicion from "../../../components/Formularios/FormularioMedicion.jsx";
import { RiDeleteBinLine } from "react-icons/ri";
import useClienteData from "../../../hooks/useClientesData";
import { useInfoClients } from "../../../context/InfoClientesContext.jsx";
import ErrorPagina from "../../../components/errores/ErrorPagina.jsx";
const InformacionClientes = () => {
  const { id } = useParams();
  const {
    getClienteById,
    getMedicionClienteById,
    getPagosClienteById,
    setCliente,
    setMediciones,
    actualizarCliente,
    mediciones,
    crearMedicion,
    eliminarMedicion,
    cliente,
    isLoading,
    error,
  } = useClienteData();

  const [showPayments, setShowPayments] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showActivities, setShowActivities] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState("one");
  const [editingClient, setEditingClient] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'editClient' o 'nuevaMedicion'
  const [editingMedicion, setEditingMedicion] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null)
  const [pagos, setPagos] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [formValues, setFormValues] = useState({
    peso: "",
    altura: "",
    imc: "",
    cirBrazo: "",
    cirPiernas: "",
    cirCintura: "",
    cirPecho: "",
    clienteID: "",
  });

  useEffect(() => {
    fetchData(currentPage);

    // Llamamos a la función fetchData para obtener los datos cuando el ID cambie o cuando shouldRefetch sea true
    if (id || shouldRefetch) {
      fetchData();
      setShouldRefetch(false); // Restablecer shouldRefetch después de obtener los datos
    }
  }, [id, shouldRefetch, currentPage]);

  // Lógica para obtener los datos del cliente y las mediciones
  const fetchData = async (page) => {
    try {
      const clienteResponse = await getClienteById(id, page); // Obtenemos los datos del cliente
      const medicionesResponse = await getMedicionClienteById(id, page); // Obtenemos las mediciones
      const pagosResponse = await getPagosClienteById(id, page);
      setCliente(clienteResponse); // Actualizamos el estado del cliente
      setMediciones(medicionesResponse.items); // Actualizamos el estado de las mediciones
      setPagos(pagosResponse.items);
      setTotalPages(medicionesResponse.totalPages);
      if (pagosResponse.items.length === 0) {
        setErrorMessage("Este cliente no posee pagos disponibles.");
      }
    } catch (error) {
      // Manejo de errores
      console.error("Error al obtener datos del cliente y mediciones:", error);
    }
  };
  const handleEliminarMedicion = async (medicionId) => {
    try {
      await eliminarMedicion(medicionId);
      // Actualiza la lista de mediciones después de eliminar una medición
      const medicionesResponse = await getMedicionClienteById(id, 1);
      setMediciones(medicionesResponse.items);
      toast.success("Medición eliminada con éxito");
      // También puedes recargar la página para actualizar los datos
      // window.location.reload();
    } catch (error) {
      console.error("Error al eliminar medición:", error);
      toast.error("Error al eliminar la medición");
    }
  };

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber); // Actualiza la página actual

    try {
      // Llama a fetchData con el número de página actual
      await fetchData(pageNumber);
    } catch (error) {
      // Manejo de errores
      console.error("Error al obtener datos del cliente y mediciones:", error);
    }
  };

  useEffect(() => {
    // Llama a la función fetchData solo cuando cambie currentPage
    fetchData(currentPage);
  }, [currentPage]);

  // Función para obtener las iniciales del nombre y del apellido
  const getInitials = (name) => {
    const words = name.split(" ");
    const initials = words.map((word) => word.charAt(0)).join("");
    return initials.toUpperCase();
  };
  const initials = cliente ? getInitials(cliente.nombre) : "";

  const ButtonBasic2 = ({ initials }) => {
    return <div className="circle initials">{initials}</div>;
  };
  // Función para manejar el cambio de pestaña
  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Actualiza los estados para mostrar u ocultar las tablas según la pestaña seleccionada
    if (newValue === "one") {
      setShowPayments(true);
      setShowMeasurements(false);
      setShowActivities(false);
    } else if (newValue === "two") {
      setShowPayments(false);
      setShowMeasurements(true);
      setShowActivities(false);
    } else if (newValue === "three") {
      setShowPayments(false);
      setShowMeasurements(false);
      setShowActivities(true);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (modalAction === "editClient") {
      setEditingClient((prevEditingClient) => ({
        ...prevEditingClient,
        [name]: value,
      }));
    } else if (modalAction === "nuevaMedicion") {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [name]: value,
      }));
    }
  };

  const handleMedicionChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({
      // Actualiza el estado formValues
      ...prevFormValues,
      clienteID: id,
      [name]: value, // Actualiza el valor del campo correspondiente
    }));
  };

  // Función para abrir el modal cuando se hace clic en "Editar Cliente"
  const handleEditClientClick = () => {
    setEditingClient(cliente);
    setModalOpen(true);
    setModalAction("editClient");
  };

  const handleNuevaMedicionClick = () => {
    setModalOpen(true);
    setModalAction("nuevaMedicion");
  };
  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCrearMedicion = async (e) => {
    e.preventDefault();
    try {
      await crearMedicion(id, formValues);
      // Actualizar la lista de mediciones después de crear una nueva
      const medicionesResponse = await getMedicionClienteById(id, 1);
      setMediciones(medicionesResponse.items);
      toast.success("Medición creada con éxito");
      fetchData(currentPage);
      setModalOpen(false); // Cerrar el modal después de crear la medición
    } catch (error) {
      console.error("Error al crear medición:", error);
      toast.error("Error al crear la medición");
    }
  };

  const handleAceptar = async () => {
    try {
      const updatedCliente = await actualizarCliente(id, editingClient);
      setCliente(updatedCliente.data); // Actualiza el estado del cliente con los nuevos datos
      setModalOpen(false);
      toast.success("Cliente actualizado con exito");
      setShouldRefetch(true); // Indicar que se deben obtener los datos actualizados
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      toast.error("Error al actualizar el cliente");
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
        <div style={{ marginLeft: "3%" }}>
          <Link to="/clientes">
            <button className="custom-button">
              <IoArrowBackSharp />
            </button>
          </Link>
        </div>
        <div className="cuadro-medio">
          {cliente && (
            <div className="info-cliente">
              <div>
                <ButtonBasic2 initials={initials} />
              </div>
              <div style={{ marginLeft: "10%" }}>
                <h3 style={{ color: "#667085" }}>{cliente.nombre}</h3>
                {/*
                <Alert
                  variant="outlined"
                  severity="error"
                  style={{ borderRadius: "50px", backgroundColor: "#FFCFCF" }}
                >
                  Este cliente tiene 1 pago atrasado
                </Alert>
                 */}
              </div>
              <div
                className="d-flex justify-content-center mb-4"
                style={{ marginLeft: "3%" }}
              >
                <ButtonBasic
                  icon={<IoPencilOutline />}
                  color="secondary"
                  text="Editar Cliente"
                  onClick={handleEditClientClick}
                />
              </div>
            </div>
          )}
          {/* Modal que se abre al editar */}
          <ModalBase
            open={modalOpen}
            title={
              modalAction === "editClient" ? "Editar Cliente" : "Nueva Medición"
            }
            closeModal={handleCloseModal}
          >
            {modalAction === "editClient" ? (
              <FormularioCliente
                cliente={editingClient}
                onInputChange={handleInputChange}
                onAceptar={handleAceptar}
              />
            ) : (
              <FormularioMedicion
                formValues={formValues}
                onInputChange={handleMedicionChange}
                onCrearMedicion={handleCrearMedicion}
              />
            )}
          </ModalBase>
          <hr />
          {cliente && (
            <div className="datos-extras">
              <div>
                <h4 style={{ fontSize: "30px", color: "#667085" }}>
                  Plan Actual
                </h4>
                <p style={{ fontSize: "20px", textAlign: "center" }}>Mensual</p>
              </div>
              <div>
                <h4 style={{ fontSize: "30px", color: "#667085" }}>RUC</h4>
                <p style={{ fontSize: "20px" }}>{cliente.ruc}</p>
              </div>
              <div>
                <h4 style={{ fontSize: "30px", color: "#667085" }}>
                  N° de Telefono
                </h4>
                <p style={{ fontSize: "20px", textAlign: "center" }}>
                  {cliente.telefono}
                </p>
              </div>
            </div>
          )}
          <div style={{ marginLeft: "73%" }}>
            <ButtonBasic
              icon={<IoAdd />}
              color="secondary"
              text="Nueva Medicion"
              onClick={handleNuevaMedicionClick}
            />
          </div>
          <div className="d-flex justify-content-center">
            <div className="d-flex justify-content-center mb-3">
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
              >
                <Tab value="one" label="Pagos" />
                <Tab value="two" label="Mediciones" />
                <Tab value="three" label="Actividades" />
              </Tabs>
            </div>
          </div>

          {/* Renderiza la tabla de pagos si showPayments es true */}
          {showPayments && (
            <>
              {pagos.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">N° Factura</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.map((pago) => (
                      <tr key={pago.id}>
                        <td style={{ color: "#6941C6" }}>{pago.nroFactura}</td>
                        <td>{pago.fecha}</td>
                        <td>{pago.monto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>{errorMessage}</p>
              )}
            </>
          )}

          {/* Renderiza la tabla de mediciones si showMeasurements es true */}
          {showMeasurements && (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Peso(kg)</th>
                  <th scope="col">Altura(cm)</th>
                  <th scope="col">Imc</th>
                  <th scope="col">Brazo(cm)</th>
                  <th scope="col">Piernas(cm)</th>
                  <th scope="col">Cintura(cm)</th>
                  <th scope="col">Pecho(cm)</th>
                </tr>
              </thead>
              <tbody>
                {mediciones && mediciones.length > 0 ? (
                  mediciones.map((medicion, index) => (
                    <tr key={index}>
                      <td style={{ color: "#6941C6" }}>{medicion.fecha}</td>
                      <td>{medicion.peso}</td>
                      <td>{medicion.altura}</td>
                      <td>{medicion.imc}</td>
                      <td>{medicion.cirBrazo}</td>
                      <td>{medicion.cirPiernas}</td>
                      <td>{medicion.cirCintura}</td>
                      <td>{medicion.cirPecho}</td>
                      <td>
                        <button
                          className="btn"
                          onClick={() => handleEliminarMedicion(medicion.id)}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No hay mediciones disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {showActivities && (
            <TablaActividadesCliente clienteId={id} toast={toast} />
          )}
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </CartaPrincipal>
    </>
  );
};

export default InformacionClientes;
