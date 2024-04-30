import React, { useEffect, useState } from "react";
import { Table } from "../../components/table/Table";
import api from "../../utils/api";
import Pagination from "../../components/pagination/PaginationContainer";
import { Toaster, toast } from "react-hot-toast";

const ArqueoListaPage = () => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const getArqueos = async (page) => {
    try {
      const response = await api.get(`/arqueo/page/${page}`);
      console.log(response.data.items);
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
