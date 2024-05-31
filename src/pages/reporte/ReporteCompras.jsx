import React, { useState, useEffect } from "react";

import ButtonBasic from "../../components/bottons/ButtonBasic";
import api from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import Pagination from "../../components/pagination/PaginationContainer";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";
import { IoCheckmark } from "react-icons/io5"; 

const ReporteCompras = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(false);
  const [nombreProveedor, setNombreProveedor] = useState("");
  const [dateIni, setDateIni] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [nroFactura, setNroFactura] = useState(null);
  const [estado, setEstado] = useState(""); 
  const [facturas, setFacturas] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPagado, setTotalPagado] = useState(0);
  const [totalPendiente, setTotalPendiente] = useState(0);
  const [prueba, setPrueba] = useState([]);

  const postReportes = async (page) => {
    const reportes = {
      nombreProveedor: nombreProveedor,
      numeroFactura: nroFactura,
      pagado: estado === "pagado" ? true : estado === "pendiente" ? false : "",
      fechaInicio: dateIni,
      fechaFin: dateFin,
    };

    try {
      const res = await api.post(`/compras/page/${page}`, reportes);
      setFacturas(res.data.facturas || []);
      setPrueba(facturas);
      setTotal(res.data.total);
      setTotalPagado(res.data.totalPagado);
      setTotalPendiente(res.data.totalPendiente);
      setTotalPages(res.data.totalPages);
      setError(false);
    } catch (error) {
      setError(true);
      console.error("Error al obtener los reportes:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    postReportes(currentPage);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    postReportes(1);
  };

  const handleClear = () => {
    setDateFin("");
    setDateIni("");
    setEstado("");
    setNroFactura("");
    setNombreProveedor("");
    setFacturas(prueba);
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleEstadoChange = (estado) => {
    setEstado(estado);
  };

  const getEstadoName = (estado) => {
    if (estado === "pagado") return "Pagado";
    if (estado === "pendiente") return "Pendiente";
    return "Estado";
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

      <CartaPrincipal>
        <div>
          <div className="d-flex">
            <h1>Reportes de Compras</h1>
          </div>

          <div className="card-body d-flex align-items-center">
            <form className="d-flex flex-grow-1 align-items-center" onSubmit={handleSearch}>
              <input
                id="input-date-ini"
                className="form-control custom-input"
                type="date"
                value={dateIni}
                onChange={(e) => setDateIni(e.target.value)}
              />
              <input
                id="input-date-fin"
                className="form-control custom-input"
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
              <input
                id="input-nombre-proveedor"
                className="form-control custom-input"
                type="text"
                placeholder="Proveedor..."
                value={nombreProveedor}
                onChange={(e) => setNombreProveedor(e.target.value)}
              />
              <input
                id="input-nro-factura"
                className="form-control custom-input"
                type="text"
                placeholder="Nº Factura..."
                value={nroFactura}
                onChange={(e) => setNroFactura(e.target.value)}
              />
              <div className="dropdown">
                <button
                  id="btn-filtrar"
                  type="button"
                  className="btn btn-primary dropdown-toggle btn-filtrar"
                  data-bs-toggle="dropdown"
                  style={{marginLeft: '2rem'}}
                >
                  {estado ? getEstadoName(estado) : <IoCheckmark />}
                  {estado ? null : "Filtrar por estado..."}
                </button>
                <ul className="dropdown-menu">
                  <li onClick={() => handleEstadoChange("pagado")} className="dropdown-item">
                    Pagado
                  </li>
                  <li onClick={() => handleEstadoChange("pendiente")} className="dropdown-item">
                    Pendiente
                  </li>
                  <li onClick={() => handleEstadoChange("")} className="dropdown-item">
                    Todos
                  </li>
                </ul>
              </div>
              <ButtonBasic
                id="btn-buscar"
                text="Buscar"
                onClick={handleSearch}
              />
              <ButtonBasic
                id="btn-limpiar"
                text="Limpiar"
                onClick={handleClear}
              />
            </form>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th scope="col">Nº Factura</th>
                <th scope="col">Fecha</th>
                <th scope="col">Proveedor</th>
                <th scope="col">RUC</th>
                <th scope="col">Estado</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {facturas.length > 0 ? (
                facturas.map((factura) => (
                  <tr key={factura.id}>
                    <td style={{ color: "#6941C6" }}>{factura.nroFactura}</td>
                    <td>{factura.fecha}</td>
                    <td>{factura.nombreProveedor}</td>
                    <td>{factura.rucProveedor}</td>
                    <td>{factura.pagado ? "Pagado" : "Pendiente"}</td>
                    <td>{formatNumber(factura.total)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No hay facturas disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="total-section d-flex justify-content-center">
          <h4 style={{ marginRight: "6rem" }}>Total Pagado: {formatNumber(totalPagado)}</h4>
          <h4 style={{ marginRight: "6rem" }}>Total Pendiente: {formatNumber(totalPendiente)}</h4>
          <h4 style={{ marginRight: "6rem" }}>Total: {formatNumber(total)}</h4>
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </CartaPrincipal>
    </>
  );
};

export default ReporteCompras;
