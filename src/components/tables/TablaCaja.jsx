import React, { useState, useEffect } from "react";
import ButtonBasic from "../bottons/ButtonBasic";
import BotonCrear from "../bottons/ButtonCrear";
import ErrorPagina from "../../components/errores/ErrorPagina";
import Pagination from "../../components/pagination/PaginationContainer";
const TablaCaja = ({ items, totalPages, currentPage, onPageChange  }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByInvoice, setFilterByInvoice] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("");
  // Calculamos el índice inicial y final de los elementos a mostrar en la página actual
  const startIndex = (currentPage - 1) * 5;
  const endIndex = Math.min(startIndex + 5, items.length);

  // Extraemos los elementos a mostrar en la página actual
  const currentPageItems = items.slice(startIndex, endIndex);
  const filteredItems = items.filter((item) => {
    const proveedorMatch = searchTerm
      ? item.factura.nombreProveedor
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;
    const invoiceMatch = item.factura.nroFactura.includes(filterByInvoice);
    const statusMatch = filterByStatus
      ? item.factura.pagado === (filterByStatus === "Pagado")
      : true;
    return proveedorMatch && invoiceMatch && statusMatch;
  });
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/facturas-proveedores/proveedor/${searchTerm}/page/${currentPage}`
      );
      const data = await response.json();
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handlePageChange = (page) => {
    onPageChange(page);
  };
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      setCurrentPage(1);
      fetchData();
    }
  };
  

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="card-body d-flex align-items-center ">
          <input
            id="input-search"
            className="form-control custom-input"
            type="text"
            placeholder="Buscar por proveedor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ButtonBasic id="btn-buscar" text="Buscar" onClick={handleSearch} />
        </div>
        
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">N° Factura</th>
            <th scope="col">Fecha</th>
            <th scope="col">Proveedor</th>
            <th scope="col">RUC</th>
            <th scope="col">Estado</th>
            <th scope="col">Total(Gs)</th>
          </tr>
        </thead>
        {currentPageItems.map((item, index) => (
          <tr key={index}>
            <td style={{ color: "#6941C6" }}>{item.factura.nroFactura}</td>
            <td>{item.factura.fecha}</td>
            <td>{item.factura.nombreProveedor}</td>
            <td>{item.factura.rucProveedor}</td>
            <td>{item.factura.pagado ? "Pagado" : "Pendiente"}</td>
            <td>{item.factura.subTotal}</td>
          </tr>
        ))}
      </table>
      <div className="pagination-container">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TablaCaja;
