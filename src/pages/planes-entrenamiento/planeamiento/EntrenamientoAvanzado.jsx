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
import { IoCheckmark } from "react-icons/io5";
import { usePlanes } from "../../../hooks/usePlanes";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
const EntrenamientoAvanzado = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();
  const { getProgramasAvanzado, getProgramasByActividad, getActividades } =
    usePlanes();

  useEffect(() => {
    fetchData();
    fetchActividades();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getProgramasAvanzado();
      setData(res);
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
    navigate(`/planes-entrenamiento/avanzado/${programa.id}`);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value === "") {
      fetchData(); // Restablece los elementos cuando el campo de búsqueda está vacío
      setNotFound(false); // Restablece el estado notFound cuando borras el contenido del campo de búsqueda
    }
  };

  const handleSearch = async () => {
    if (search === "") {
      fetchData();
      return;
    }

    setIsLoading(true);
    try {
      const res = await getProgramasAvanzado(1, search); // Aquí pasa el parámetro de búsqueda
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

  const handleFilter = async (actividad) => {
    setIsLoading(true);
    try {
      const res = await getProgramasByActividad("Avanzado", actividad.nombre);
      setData(res);
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
  };

  const switchRender = () => {
    if (isLoading) return <Loader />;

    if (notFound)
      return <ListaVacía mensaje="No hay entrenamientos con ese nombre." />;

    if (error)
      return <ErrorPagina mensaje="Ha ocurrido un error cargando los datos." />;

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
              <tr
                key={programa.id}
                onClick={() => handleProgramaClick(programa)}
              >
                <td>{programa.titulo}</td>
                <td>{programa.nombreActividad}</td>
                <td>{programa.nivel}</td>
                <td>{programa.sexo}</td>
                <td class="text-center">
                  <a
                    id={`btn-eliminar-programa-${programa.id}`}
                    href="#"
                    onClick={() => handleShowAlert(programa)}
                    style={{ fontSize: "1.2rem" }}
                  >
                    <RiDeleteBinLine />
                  </a>
                  <a
                    id={`btn-editar-programa-${programa.id}`}
                    href="#"
                    onClick={() => handleEditarprograma(programa)}
                    style={{ marginLeft: "1.5em", fontSize: "1.2rem" }}
                  >
                    <FiEdit2 />
                  </a>
                </td>{" "}
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
        <h1>Planes de Entrenamiento - Avanzado</h1>
      </div>
      {/* Menú de búsqueda */}
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
        {/*        <div className="dropdown">
          <button
            id="btn-filtrar"
            type="button"
            className="btn btn-secundary dropdown-toggle btn-filtrar"
            data-bs-toggle="dropdown"
            style={{ fontSize: "1.02rem", marginLeft: "1.5rem" }}
          >
            <IoCheckmark />
            Filtrar por
          </button>
          <ul className="dropdown-menu" aria-labelledby="btn-filtrar">
            {actividades.map((actividad) => (
              <li key={actividad.id}>
                <button
                  className="dropdown-item"
                  onClick={() => handleFilter(actividad.nombre)}
                >
                  {actividad.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>
         */}
      </div>
      {switchRender()}
      {/* Modal */}
      {showModal && (
        <ModalBase onClose={handleCloseModal}>
          <NuevoEjercicioForm />
        </ModalBase>
      )}
    </CartaPrincipal>
  );
};

export default EntrenamientoAvanzado;
