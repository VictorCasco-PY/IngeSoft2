import React, { useEffect, useState } from "react";
import useClienteData from "../../hooks/useClientesData";
import CircularProgress from "@mui/material/CircularProgress";

import { RiDeleteBinLine } from "react-icons/ri";
import { formatFecha } from "../../utils/Formatting";
import ErrorPagina from "../errores/ErrorPagina";
import { ListaVacía } from "../errores/ListaVacía";
import { Table } from "../table/Table";
import Pagination from "../pagination/PaginationContainer";
import CustomAlert from "../alert/CustomAlert";

const TablaMedicionesCliente = ({ toast, clienteId }) => {
  const {
    getMedicionClienteById,
    mediciones,
    setMediciones,
    isLoading,
    eliminarMedicion,
  } = useClienteData();
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [medicionId, setMedicionId] = useState(null);

  const getMediciones = async (page) => {
    try {
      const res = await getMedicionClienteById(clienteId, page);
      setMediciones(res.items);
      setTotalPages(res.totalPages);
      if (res.items.length === 0) {
        setErrorMessage("Este cliente no posee mediciones.");
      }
    } catch (error) {
      if (toast) {
        if (error.response.status === 404) {
          setErrorMessage("Este cliente no posee mediciones.");
        } else {
          setErrorMessage("Ha ocurrido un error al solicitar las mediciones.");
          toast.error("Error al cargar mediciones. Revise la conexión.");
        }
      }
    }
  };

  useEffect(() => {
    getMediciones(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEliminarMedicion = (medicionId) => {
    setShowAlert(true); // Muestra el mensaje de confirmación
    setMedicionId(medicionId); // Guarda el ID de la medición a eliminar
  };

  const handleConfirmDelete = async () => {
    try {
      await eliminarMedicion(medicionId);
      const medicionesResponse = await getMedicionClienteById(
        clienteId,
        currentPage
      );
      setMediciones(medicionesResponse.items);
      setShowAlert(false); // Oculta el mensaje de confirmación
      toast.success("Medición eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar medición:", error);
      toast.error("Error al eliminar la medición");
    }
  };

  const handleCancelDelete = () => {
    setShowAlert(false); // Oculta la alerta
  };

  const switchRender = () => {
    if (isLoading)
      return (
        <Table
          headers={[
            "Fecha",
            "Peso(kg)",
            "Altura(cm)",
            "IMC",
            "Brazo(cm)",
            "Piernas(cm)",
            "Cintura(cm)",
            "Pecho(cm)",
          ]}
          striped
        >
          <td colSpan="8" style={{ textAlign: "center" }}>
            <div style={{ display: "inline-block" }}>
              <CircularProgress />
            </div>
          </td>
        </Table>
      );

    if (!mediciones || mediciones.length <= 0)
      return <ListaVacía mensaje={"No existen mediciones para este cliente"} />;

    return (
      <>
        <Table
          headers={[
            "Fecha",
            "Peso(kg)",
            "Altura(cm)",
            "IMC",
            "Brazo(cm)",
            "Piernas(cm)",
            "Cintura(cm)",
            "Pecho(cm)",
          ]}
          striped
        >
          {mediciones.map((medicion) => {
            return (
              <tr key={medicion.id} className="rowClickable">
                <td style={{ color: "#7749F8" }} scope="row">
                  {formatFecha(medicion.fecha)}
                </td>
                <td>{medicion.peso}</td>
                <td>{medicion.altura}</td>
                <td>{medicion.imc}</td>
                <td>{medicion.cirBrazo}</td>
                <td>{medicion.cirPiernas}</td>
                <td>{medicion.cirCintura}</td>
                <td>{medicion.cirPecho}</td>
                <td>
                  <a onClick={() => handleEliminarMedicion(medicion.id)}>
                    <RiDeleteBinLine />
                  </a>
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
        {showAlert && (
          <CustomAlert
            message={`¿Estás seguro de eliminar esta medición?`}
            confirmText="Aceptar"
            cancelText="Cancelar"
            confirmAction={handleConfirmDelete}
            cancelAction={handleCancelDelete}
            show={showAlert} // Pasa el estado para controlar si se muestra el mensaje de confirmación
          />
        )}
      </>
    );
  };

  return <>{switchRender()}</>;
};

export default TablaMedicionesCliente;
