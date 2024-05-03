import React, { useEffect, useState } from "react";
import { Btn } from "../../../components/bottons/Button";
import api from "../../../utils/api";
import FlechaAtras from "../../../components/flechaAtras/FlechaAtras";
import { Table } from "../../../components/table/Table";
import AsignarPlanAClienteModal from "./AsignarPlanAClienteModal";
import { useParams } from "react-router-dom";
import Pagination from "../../../components/pagination/PaginationContainer";
import { RiDeleteBinLine } from "react-icons/ri";
import { Toaster, toast } from "react-hot-toast";

const AsignarPlanACliente = () => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [planName, setPlanName] = useState("");

  const { id } = useParams();

  const refreshClientesList = () => {
    getClientes(currentPage);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getClientes = async (page) => {
    try {
      const response = await api.get(`/programas/${id}/clientes/page/${page}`);
      setData(response.data.items);
      console.log(response.data.items);
      setTotalPages(response.data.totalPages);
      setPlanName(response.data.items[0].programa);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCliente = async (clienteId) => {
    try {
      const response = await api.delete(
        `/programas/${id}/clientes/${clienteId}`
      );

      toast.success("Plan del cliente eliminado");
      refreshClientesList();
    } catch (error) {
      toast.error("Error al eliminar el plan:");
    }
  };

  useEffect(() => {
    getClientes(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
      <div
        className="d-flex align-items-center"
        style={{ marginTop: "1.5rem" }}
      >
        <FlechaAtras ruta={`/planes-entrenamiento/principiante/${id}`} />
        <h1 style={{ marginLeft: "3rem" }}>Clientes {planName}</h1>
      </div>
      <div className="row d-flex align-items-center mb-3">
        <div className="col-4">
          <input
            id="input-search"
            type="text"
            className="form-control"
            placeholder="Buscar cliente..."
          />
        </div>
        <div className="col-1">
          <Btn id="btn-buscar" outline>
            Buscar
          </Btn>
        </div>
        <div className="col-1">
          <Btn id="btn-reset">Limpiar</Btn>
        </div>
        <div className="col-auto ms-auto">
          {" "}
          {/* Cambiado aquí */}
          <Btn
            type="primary"
            id="btn-asignar"
            onClick={() => handleOpenModal()}
          >
            Asignar cliente
          </Btn>
        </div>
      </div>

      <Table
        headers={[
          "Nombre del cliente",
          "Programa",
          "Fecha de inicio",
          "Acciones",
        ]}
        striped
      >
        {data.length > 0 ? (
          data.map((data, index) => (
            <tr key={index}>
              <td className="py-3">{data.nombreCliente}</td>
              <td className="py-3">{data.programa}</td>
              <td className="py-3">{data.fechaEvaluacion}</td>
              <td className="py-3">
                <button
                  id="btn-borrar"
                  className="btn btn-link p-0"
                  style={{ fontSize: "1.2rem", color: "black" }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteCliente(data.clienteId);
                  }}
                >
                  <RiDeleteBinLine />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              No hay clientes con plan asignado.
            </td>
          </tr>
        )}
      </Table>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {/* Renderiza el modal si showModal es true */}
      <AsignarPlanAClienteModal
        open={showModal}
        closeModal={handleCloseModal}
        refreshList={refreshClientesList}
      />
    </>
  );
};

export default AsignarPlanACliente;
