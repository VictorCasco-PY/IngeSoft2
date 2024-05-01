import React, { useState, useEffect } from "react";
import Pagination from "../pagination/PaginationContainer";
import { usePlanes } from "../../hooks/usePlanes";
import ErrorPagina from "../errores/ErrorPagina";
import { ListaVacía } from "../errores/ListaVacía";
import { Table } from "../table/Table";
import CircularProgress from "@mui/material/CircularProgress";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
const TablaEjercicios = ({
  programaId,
  page,
  setParentTotalPages,
  onPageChange,
}) => {
  const { getProgramasById,eliminarEjercicio } = usePlanes();
  const [loadTable, setLoadTable] = useState(true);
  const [ejercicios, setEjercicios] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ejercicioToDelete, setEjercicioToDelete] = useState(null);
  useEffect(() => {
    fetchEjercicios(programaId, page);
  }, [programaId, page]);

  const fetchEjercicios = async (programaId, page) => {
    try {
      const ejerciciosResponse = await getProgramasById(programaId, page);
      setEjercicios(ejerciciosResponse);

      setTotalPages(ejerciciosResponse.totalPages);
      if (ejerciciosResponse.items.length === 0) {
        setErrorMessage("Este programa no tiene ejercicios disponibles.");
      } else {
        setErrorMessage(null);
      }
      setLoadTable(false);
    } catch (error) {
      console.error("Error al obtener ejercicios del programa:", error);
      setErrorMessage("Ha ocurrido un error al obtener los ejercicios.");
      setLoadTable(false);
    }
  };
  const handleDelete = async (ejercicioId) => {
    try {
      // Eliminar el ejercicio
      await eliminarEjercicio(programaId, ejercicioId);
      toast.success("Producto eliminado satisfactoriamente");
      // Actualizar la lista de ejercicios
      setEjercicios((prevEjercicios) => ({
        ...prevEjercicios,
        items: prevEjercicios.items.filter((ejercicio) => ejercicio.id !== ejercicioId),
      }));
    } catch (error) {
      console.error("Error al eliminar el ejercicio:", error);
      // Aquí puedes mostrar un mensaje de error al usuario si la eliminación falla
    }
  };

  const handleShowConfirmation = (ejercicioId) => {
    setShowConfirmation(true);
    setEjercicioToDelete(ejercicioId);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setEjercicioToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (ejercicioToDelete) {
      try {
        await handleDelete(ejercicioToDelete);
        setShowConfirmation(false);
      } catch (error) {
        console.error("Error al eliminar el ejercicio:", error);
        // Aquí puedes mostrar un mensaje de error al usuario si la eliminación falla
      }
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchEjercicios(programaId, pageNumber);
  };

  const switchRender = () => {
    if (loadTable) {
      return (
        <Table headers={["Nombre", "Tiempo", "Peso", "Descripción"]} striped>
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>
              <div style={{ display: "inline-block" }}>
                <CircularProgress />
              </div>
            </td>
          </tr>
        </Table>
      );
    }

    if (ejercicios.items && ejercicios.items.length <= 0) {
      return <ListaVacía mensaje={errorMessage} />;
    }

    if (errorMessage) {
      return <ErrorPagina mensaje={errorMessage} />;
    }

    if (ejercicios.items) {
      return (
        <>
          <table className="custom-table mt-3">
            <thead>
              <tr>
                <th scope="col">Nombre </th>
                <th scope="col">Tiempo</th>
                <th scope="col">Peso</th>
                <th scope="col">Descripcion</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {ejercicios.items.map((ejercicio) => (
                <tr key={ejercicio.id}>
                  <td>{ejercicio.nombre}</td>
                  <td>{ejercicio.tiempo}</td>
                  <td>{ejercicio.peso}</td>
                  <td>{ejercicio.descripcion}</td>
                  <td class="text-center">
                    <a
                      id={`btn-eliminar-programa-${ejercicio.id}`}
                      href="#"
                      onClick={() => handleDelete(ejercicio.id)}
                      style={{ fontSize: "1.2rem" }}
                    >
                      <RiDeleteBinLine />
                    </a>
                    <a
                      id={`btn-editar-programa-${ejercicio.id}`}
                      href="#"
                      onClick={() => handleEditarprograma(ejercicio)}
                      style={{ marginLeft: "1.5em", fontSize: "1.2rem" }}
                    >
                      <FiEdit2 />
                    </a>
                  </td>
                  {/* Añade botones u opciones para editar o eliminar si es necesario */}
                </tr>
              ))}
            </tbody>
          </table>
        
          {showConfirmation && ejercicioToDelete && (
            <CustomAlert
              message={`¿Estás seguro de eliminar este ejercicio?`}
              confirmText="Aceptar"
              cancelText="Cancelar"
              confirmAction={handleConfirmDelete}
              cancelAction={handleCancelDelete}
            />
          )}
          <div className="d-flex justify-content-center mt-4">
            {/**
            <Pagination
              totalPages={ejercicios?.totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            /> */}
          </div>
        </>
      );
    }
  };

  return <>{switchRender()}</>;
};

export default TablaEjercicios;
