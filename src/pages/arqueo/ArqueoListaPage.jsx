import React, { useEffect, useState } from "react";
import { Table } from "../../components/table/Table";
import api from "../../utils/api";
import Pagination from "../../components/pagination/PaginationContainer";

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
      console.log(error);
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
      <Table
        headers={["Fecha", "Caja", "Saldo de apertura", "Saldo de cierre"]}
        striped
      >
        {data.map((arqueo, index) => (
          <tr key={index}>
            <td className="py-3">{arqueo.fecha}</td>
            <td className="py-3">Caja</td>
            <td className="py-3">0</td>
            <td className="py-3">
              {arqueo.montoTotal.toLocaleString("es-ES")}
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
