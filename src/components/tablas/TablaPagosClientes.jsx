import React, { useState, useEffect } from "react";
import Pagination from "../pagination/PaginationContainer";
import useClienteData from "../../hooks/useClientesData";
import ErrorPagina from "../errores/ErrorPagina";
import { ListaVacía } from "../errores/ListaVacía";
import { Table } from "../table/Table";
import CircularProgress from "@mui/material/CircularProgress";

const TablaPagosClientes = ({ clienteId, page, setParentTotalPages }) => {
  const { getPagosClienteById } = useClienteData();
  const [loadTable, setLoadTable] = useState(true);
  const [pagos, setPagos] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPagos(page);
  }, [clienteId, page]);

  const fetchPagos = async (page) => {
    try {
      const pagosResponse = await getPagosClienteById(clienteId, page);
      setPagos(pagosResponse);
      setTotalPages(pagosResponse.totalPages);
      if (pagosResponse.items.length === 0) {
        setErrorMessage("Este cliente no posee pagos disponibles.");
      } else {
        setErrorMessage(null);
      }
      setLoadTable(false);
    } catch (error) {
      console.error("Error al obtener pagos del cliente:", error);
      setErrorMessage("Ha ocurrido un error al obtener los pagos.");
      setLoadTable(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setParentTotalPages(pageNumber);
  };

  const switchRender = () => {
    if (loadTable) {
      return (
        <Table headers={["N° Factura", "Fecha", "Monto"]} striped>
          <tr>
            <td colSpan="5" style={{ textAlign: "center" }}>
              <div style={{ display: "inline-block" }}>
                <CircularProgress />
              </div>
            </td>
          </tr>
        </Table>
      );
    }

    if (pagos.items && pagos.items.length <= 0) {
      return <ListaVacía mensaje={errorMessage} />;
    }

    if (errorMessage) {
      return <ErrorPagina mensaje={errorMessage} />;
    }

    if (pagos.items) {
      return (
        <>
          <Table headers={["N° Factura", "Fecha", "Monto"]} striped>
            {pagos.items.map((pago) => (
              <tr key={pago.id}>
                <td style={{ color: "#6941C6" }}>{pago.nroFactura}</td>
                <td>{pago.fecha}</td>
                <td>{pago.monto}</td>
              </tr>
            ))}
          </Table>
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              totalPages={pagos.totalPages}
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

export default TablaPagosClientes;