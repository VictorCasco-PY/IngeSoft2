import React, { useEffect, useState } from "react";
import { Table } from "../../components/table/Table";
import api from "../../utils/api";
import Pagination from "../../components/pagination/PaginationContainer";
import { Toaster, toast } from "react-hot-toast";
import { Btn } from "../../components/bottons/Button";

const ArqueoListaPage = () => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const getArqueos = async (page, fecha = null) => {
    try {
      let endpoint = fecha
        ? `/arqueo/searchByFecha/${fecha}/page/${page}` //Filtro no funciona aun
        : `/arqueo/page/${page}`;
      const response = await api.get(endpoint);
      setData(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getArqueos(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterByDate = () => {
    const fecha = document.getElementById("input-search").value;
    if (fecha) {
      getArqueos(currentPage, fecha);
    } else {
      toast.error("Ingrese una fecha para filtrar.");
    }
  };

  const handleResetFilter = () => {
    document.getElementById("input-search").value = "";
    getArqueos(currentPage);
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
      <div className="row d-flex align-items-center mb-3">
        <div className="col-4">
          <input id="input-search" type="date" className="form-control" />
        </div>
        <div className="col-1">
          <Btn id="btn-buscar" outline onClick={handleFilterByDate}>
            Filtrar
          </Btn>
        </div>
        <div className="col-1">
          <Btn id="btn-reset" outline onClick={handleResetFilter}>
            Limpiar
          </Btn>
        </div>
      </div>
      <Table
        headers={[
          "Fecha",
          "Nombre de caja",
          "Saldo de apertura",
          "Saldo de cierre",
        ]}
        striped
      >
        {data.map((arqueo, index) => (
          <tr key={index}>
            <td className="py-3">{arqueo.fecha}</td>
            <td className="py-3">{arqueo.nombreCaja}</td>
            <td className="py-3">
              {!arqueo.montoApertura == 0
                ? arqueo.montoApertura.toLocaleString("es-ES")
                : 0}{" "}
              Gs.
            </td>
            <td className="py-3">
              {arqueo.montoTotal.toLocaleString("es-ES")} Gs.
            </td>
          </tr>
        ))}
      </Table>
      <div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default ArqueoListaPage;
