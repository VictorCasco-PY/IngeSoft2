import React, { useState, useEffect } from "react";
import { ListaVacía } from "../../../components/errores/ListaVacía";
import { Loader } from "../../../components/layout/Loader";
import ErrorPagina from "../../../components/errores/ErrorPagina";
import ModalBase from "../../../components/modals/ModalBase";
import Pagination from "../../../components/pagination/PaginationContainer";
import ElementoNoEncontrado from "../../../components/errores/ElementoNoEncontrado";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";
import FlechaAtras from "../../../components/flechaAtras/FlechaAtras";
import { Table } from "../../../components/table/Table";
import { Input } from "../../../components/input/input";
import { Btn } from "../../../components/bottons/Button";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { usePlanes } from "../../../hooks/usePlanes";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../../../components/alert/CustomAlert";
import toast from "react-hot-toast";
import EditarProgramaForm from "../../../components/Formularios/EditarProgramaForm";

const EntrenamientoPrincipiante = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [programaToEdit, setProgramaToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [programaToDelete, setProgramaToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();
  const {
    getProgramasPrincipiantes,
    getProgramasByActividad,
    getActividades,
    eliminarPrograma,
    actualizarPrograma,
  } = usePlanes();

  useEffect(() => {
    fetchData();
    fetchActividades();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getProgramasPrincipiantes();
      setData(res);
      if (res.items.length === 0) {
        setNotFound(true);
      } else {
        setNotFound(false);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActividades = async () => {
    try {
      const res = await getActividades();
      setActividades(res.items);
    } catch (error) {
      setError(error);
    }
  };

  const handleProgramaClick = (programa) => {
    navigate(`/planes-entrenamiento/principiante/${programa.id}`);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value === "") {
      fetchData();
      setNotFound(false);
    }
  };

  const handleSearch = async () => {
    if (search === "") {
      fetchData();
      return;
    }

    setIsLoading(true);
    try {
      const res = await getProgramasPrincipiantes(1, search);
      setData(res);
      if (res.items.length === 0) {
        setNotFound(true);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditarPrograma = (programa) => {
    setProgramaToEdit(programa);
    setShowModal(true);
  };

  const handleUpdatePrograma = async (values) => {
    try {
      await actualizarPrograma(programaToEdit.id, values);
      toast.success("Programa actualizado satisfactoriamente");
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error("Error al actualizar el programa:", error);
      toast.error(
        "Ha ocurrido un error al actualizar el programa. Inténtalo de nuevo más tarde."
      );
    }
  };

  const handleFilter = async (actividad) => {
    setIsLoading(true);
    try {
      const res = await getProgramasByActividad(
        "PRINCIPIANTE",
        actividad.nombre
      );
      setData(res);
      if (res.items.length === 0) {
        setNotFound(true);
      } else {
        setNotFound(false);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProgramaToEdit(null);
  };

  const handleShowAlert = (programaId) => {
    setShowConfirmation(true);
    setProgramaToDelete(programaId);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setProgramaToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (programaToDelete) {
      try {
        await eliminarPrograma(programaToDelete);
        setShowConfirmation(false);
        toast.success("Programa eliminado satisfactoriamente");
        fetchData();
      } catch (error) {
        console.error("Error al eliminar el programa:", error);
        toast.error(
          "Ha ocurrido un error al eliminar el programa. Inténtalo de nuevo más tarde."
        );
      }
    }
  };

  const switchRender = () => {
    if (isLoading) return <Loader />;

    if (notFound)
      return <ListaVacía mensaje="No hay entrenamientos disponibles." />;

    if (error)
      return <ErrorPagina mensaje="Ha ocurrido un error cargando los datos." />;

    if (data.items.length === 0)
      return <ListaVacía mensaje="No hay entrenamientos disponibles." />;

    return (
      <>
        <table className="custom-table mt-3">
          <thead>
            <tr>
              <th scope="col">Nombre del entrenamiento</th>
              <th scope="col">Actividad</th>
              <th scope="col">Nivel</th>
              <th scope="col">Sexo</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.items?.map((programa) => (
              <tr key={programa.id}>
                <td
                  style={{
                    color: "#7749F8",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => handleProgramaClick(programa)}
                >
                  {programa.titulo}
                </td>
                <td onClick={() => handleProgramaClick(programa)}>
                  {programa.nombreActividad}
                </td>
                <td onClick={() => handleProgramaClick(programa)}>
                  {programa.nivel}
                </td>
                <td onClick={() => handleProgramaClick(programa)}>
                  {programa.sexo}
                </td>
                <td className="text-center">
                  <a
                    id={`btn-eliminar-programa-${programa.id}`}
                    href="#"
                    onClick={() => handleShowAlert(programa.id)}
                    style={{ fontSize: "1.2rem" }}
                  >
                    <RiDeleteBinLine />
                  </a>
                  <a
                    id={`btn-editar-programa-${programa.id}`}
                    href="#"
                    onClick={() => handleEditarPrograma(programa)}
                    style={{ marginLeft: "1.5em", fontSize: "1.2rem" }}
                  >
                    <FiEdit2 />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          totalPages={data?.totalPages}
          currentPage={data?.currentPage}
          onPageChange={(page) => fetchData(page)}
        />
      </>
    );
  };

  return (
    <CartaPrincipal>
      <div className="d-flex align-items-center gap-3">
        <FlechaAtras ruta="/planes-entrenamiento" />
        <h1>Planes de Entrenamiento - Principiante</h1>
      </div>
      <div className=" d-flex align-items-center ">
        <form className="d-flex flex-grow-1 align-items-center">
          <Input
            id="input-search"
            placeholder="Buscar..."
            onChange={(e) => handleSearchInput(e)}
          />
          <Btn id="btn-buscar" outline onClick={handleSearch}>
            Buscar
          </Btn>
        </form>
      </div>
      {switchRender()}
      {showConfirmation &&
        programaToDelete && (
          <CustomAlert
            message={`¿Estás seguro de eliminar este programa?`}
            confirmText="Aceptar"
            cancelText="Cancelar"
            confirmAction={handleConfirmDelete}
            cancelAction={handleCancelDelete}
          />
        )}
      {showModal && (
        <ModalBase
          open={showModal}
          title={"Editar Programa"}
          closeModal={handleCloseModal}
        >
          <EditarProgramaForm
            programa={programaToEdit}
            onUpdate={handleUpdatePrograma}
            onClose={handleCloseModal}
            actualizarPrograma={actualizarPrograma}
          />
        </ModalBase>
      )}
    </CartaPrincipal>
  );
};

export default EntrenamientoPrincipiante;
