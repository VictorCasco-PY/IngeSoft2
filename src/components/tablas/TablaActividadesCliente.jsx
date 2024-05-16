import React, { useEffect, useState } from "react";
import useSuscripcion from "../../hooks/useSuscripcion";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import "./TablaActividades.css";
import { capFirstMinRest, formatFecha } from "../../utils/Formatting";
import api from "../../utils/api";
import ErrorPagina from "../errores/ErrorPagina";
import { ListaVacía } from "../errores/ListaVacía";
import { Table } from "../table/Table";
import Pagination from "../pagination/PaginationContainer";
import { Btn } from "../bottons/Button";
import CustomAlert from "../alert/CustomAlert";
/*
    USO: se usa el prop clienteId para obtener las actividades de un cliente en específico.
    Se usa el prop toast para mostrar mensajes de error.
    Se usa el prop setParentTotalPages para setear el total de páginas en el componente padre. (En el componente padre, implementarlo como una funcion)
        esta función se llama cada vez que se obtienen las actividades.
    Se usa el prop page para setear la página actual.
*/

const TablaActividadesCliente = ({
  toast,
  clienteId,
  setParentTotalPages,
  page = 1,
}) => {
  // TODO: no borrar
  //const { getSuscripcionesByCliente, data: req_suscripciones, isLoading: cargandoSuscripciones, error: errorSuscripciones } = useSuscripcion();
  const [actividades, setActividades] = useState([]);
  const [loadTable, setLoadTable] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [suscripcionToDelete, setSuscripcionToDelete] = useState(null);
  const navigate = useNavigate();

  const getSuscripciones = async () => {
    setLoadTable(true);
    try {
      const res = await api.get(
        `suscripciones/cliente/${clienteId}/page/${page}`
      );
      //por el momento se utiliza esto cuando en la pagina no hay datos
      if (res.data.items.length === 0) {
        setActividades([]);
      }
      setActividades(res.data);
      if (setParentTotalPages) setParentTotalPages(res.data.totalPages); // se usa para setear el total de paginas en el componente padre
    } catch (error) {
      if (toast) {
        if (error.response.status === 404) {
          setActividades([]);
          //setErrorMessage(error.response.data.message) //no se usa porque no me gusta el formateo el error traido desde el back
          setErrorMessage("Este cliente no posee actividades.");
        } else {
          setErrorMessage("Ha ocurrido un error al solicitar las cajas.");
          toast.error("Error al cargar suscripciones. Revise la conexión.");
        }
      }
    } finally {
      setLoadTable(false);
    }
  };
  const handleAnularSuscripcion = async (suscripcionId) => {
    try {
      // Primero obtén la información de la actividad para verificar su estado
      const actividad = actividades.items.find(act => act.id === actividad.id);

      // Verifica si el estado de la actividad es "Pendiente"
      if (actividad.estado === "Pendiente") {
          toast.error("No se puede anular una suscripción pendiente de pago.");
          console.log(actividad.estado);
          return;
      }
  
      // Si el estado no es "Pendiente", procede a eliminar la suscripción
      await api.delete(`/suscripciones/${suscripcionId}`);
      setSuscripcionToDelete(suscripcion.data);
      setShowAlert(true);
      toast.success("Suscripción anulada correctamente.");
  
      // Actualiza la lista de actividades después de la anulación
      getSuscripciones();
    } catch (error) {
      console.error("Error al anular la suscripción:", error);
      toast.error("Ha ocurrido un error al anular la suscripción.");
    }
  };
  
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/suscripciones/${suscripcionToDelete.id}`);
      toast.success("Suscripción anulada correctamente.");
      setShowAlert(false);
      setSuscripcionToDelete(null); // Restablece el estado de suscripcionToDelete
      getSuscripciones();
    } catch (error) {
      console.error("Error al anular la suscripción:", error);
      toast.error("Ha ocurrido un error al anular la suscripción.");
    }
  };

  const handleCancelDelete = () => {
    // Función para cancelar la eliminación de la suscripción
    setShowAlert(false);
    setSuscripcionToDelete(null);
  };

  useEffect(() => {
    //TODO: no borrar esto, no tomar en cuenta en  code review, lo usare en el sig sprint.

    /*const fetchData = async () => {
            setLoadTable(true);
            try {
                const suscripcionesData = await getSuscripcionesByCliente(clienteId, page);
                setActividades(suscripcionesData);
            } catch (error) {
                if (toast) {
                    setActividades([]);
                    if (error.response.status === 404) {
                        setActividades([]);
                    } else {
                        toast.error("Error al cargar suscripciones. Revise la conexión.");
                    }
                }
            } finally {
                setLoadTable(false);
            }
            console.log(actividades)
        };

        fetchData();*/

    getSuscripciones(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const switchRender = () => {
    if (loadTable)
      return (
        <Table
          headers={[
            "Nombre",
            "Modalidad",
            "Estado",
            "Fecha de Inscripcion",
            "Fecha de Vencimiento",
          ]}
          striped
        >
          <td colSpan="5" style={{ textAlign: "center" }}>
            <div style={{ display: "inline-block" }}>
              <CircularProgress />
            </div>
          </td>
        </Table>
      );

    if (actividades.length <= 0 || actividades.items.length <= 0)
      return <ListaVacía mensaje={errorMessage} />;

    if (!actividades) return <ErrorPagina mensaje={errorMessage} />;

    if (actividades.items) {
      return (
        <>
        {showAlert &&
              suscripcionToDelete && ( // Muestra el mensaje de confirmación si showAlert es true y hay una suscripción para eliminar
                <CustomAlert
                  message={`¿Estás seguro de eliminar tu suscripción ${suscripcionToDelete.nombre}?`}
                  confirmText="Aceptar"
                  cancelText="Cancelar"
                  confirmAction={handleConfirmDelete}
                  cancelAction={handleCancelDelete}
                />
              )}
          <Table
            headers={[
              "Nombre",
              "Modalidad",
              "Estado",
              "Fecha de Inscripcion",
              "Fecha de Vencimiento",
            ]}
            striped
          >
            {actividades.items.map((actividad) => {
              return (
                <tr
                  key={actividad.id}
                  onClick={() => {
                    navigate(`/infoServicio/${actividad.actividadId}`);
                  }}
                  className="rowClickable"
                >
                  <td style={{ color: "#7749F8" }} scope="row">
                    {actividad.actividadNombre}
                  </td>
                  <td>{capFirstMinRest(actividad.modalidad)}</td>
                  <td>{capFirstMinRest(actividad.estado)}</td>
                  <td>{formatFecha(actividad.fechaInicio)}</td>
                  <td>{formatFecha(actividad.fechaFin)}</td>
                  <td>
                    {/* Agrega el botón o enlace para anular la suscripción */}
                    
                      <Btn
                        type="danger"
                        onClick={() => handleAnularSuscripcion(actividad.id)}
                      >
                        Anular Suscripcion
                      </Btn>
                    
                  </td>
                </tr>
              );
            })}

          </Table>
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      );
    }
  };

  return <>{switchRender()}</>;
};

export default TablaActividadesCliente;
