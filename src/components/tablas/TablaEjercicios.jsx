import React, { useState, useEffect } from "react";
import Pagination from "../pagination/PaginationContainer";
import { usePlanes } from "../../hooks/usePlanes";
import ErrorPagina from "../errores/ErrorPagina";
import { ListaVacía } from "../errores/ListaVacía";
import CircularProgress from "@mui/material/CircularProgress";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import CustomAlert from "../alert/CustomAlert";
import toast from "react-hot-toast";

const TablaEjercicios = ({ programaId }) => {
  const { getEjerciciosByProgramaId, eliminarEjercicio } = usePlanes();
  const [loadTable, setLoadTable] = useState(true);
  const [ejercicios, setEjercicios] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ejercicioToDelete, setEjercicioToDelete] = useState(null);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    fetchEjercicios(programaId, currentPage);
  }, [programaId, currentPage]);

  const fetchEjercicios = async (programaId, page) => {
    try {
      const ejerciciosResponse = await getEjerciciosByProgramaId(programaId, page);
      setEjercicios(ejerciciosResponse);
      setTotalPages(ejerciciosResponse.totalPages);
      setErrorMessage(null);
      setLoadTable(false);
      if(ejerciciosResponse.items.length === 0){
        setNotFound(true);
      }
      else{
        setNotFound(false);
      }
    } catch (error) {
      console.error("Error al obtener ejercicios del programa:", error);
      //setErrorMessage("Ha ocurrido un error al obtener los ejercicios.");
      setLoadTable(false);
      console.log(notFound);
    }
  };

  const isVacio = () => {
    if (notFound)
      return <ListaVacía mensaje="No hay entrenamientos disponibles." />;
  }

  const handleDelete = async (ejercicioId) => {
    try {
      await eliminarEjercicio(programaId, ejercicioId);
      fetchEjercicios(programaId, currentPage);
      toast.success('Ejercicio eliminado satisfactoriamente');
    } catch (error) {
      console.error('Error al eliminar el ejercicio:', error);
      toast.error('Ha ocurrido un error al eliminar el ejercicio. Inténtalo de nuevo más tarde.');
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
  };

  return (
    <>
      {loadTable ? (
        <CircularProgress />
      ) : notFound ? (
        <ListaVacía mensaje="No hay ejercicios disponibles." />
      ) : (
    
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
                          onClick={() => handleShowConfirmation(ejercicio.id)} // Cambiado aquí
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
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TablaEjercicios;
