import React, { useEffect, useState } from "react";
import FlechaAtras from "../../../../components/flechaAtras/FlechaAtras";
import classes from "./ListaVentas.module.css";
import api from "../../../../utils/api";
import Pagination from "../../../../components/pagination/PaginationContainer";
import { Btn } from "../../../../components/bottons/Button";
import DetalleFacturaModal from "./DetalleFacturaModal";
import { toast, Toaster } from "react-hot-toast";
import { VolverAtras } from "../../../../components/bottons/VolverAtras";

const ListaVentas = () => {
  const [facturas, setFacturas] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [detalleFactura, setDetalleFactura] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [estado, setEstado] = useState("");

  const closeModal = () => {
    setModalOpen(false);
  };

  const showModal = (factura) => {
    setDetalleFactura(factura);
    setModalOpen(true);
  };

  const getFacturas = async (page) => {
    setIsLoading(true);
    try {
      let response;
      if (estado === "") {
        response = await api.get(`/facturas/page/${page}`);
      } else if (estado === "pagado") {
        response = await api.get(`/facturas/estado/pagado/page/${page}`);
      } else {
        response = await api.get(`/facturas/estado/pendiente/page/${page}`);
      }
      setFacturas(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setFacturas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarPorNombre = async (nombre, page) => {
    try {
      const response = await api.get(
        `/facturas/cliente/${nombre}/page/${page}`
      );
      setFacturas(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Cliente no encontrado");
    }
  };

  useEffect(() => {
    getFacturas(currentPage);
  }, [currentPage, estado]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = () => {
    filtrarPorNombre(searchTerm, currentPage);
    setSearchTerm("");
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className={classes.form_container}>
        <div className={classes.title_container}>
          <FlechaAtras ruta={"/caja"} />
          <h1 className={classes.title}>Lista de ventas</h1>
        </div>
        <div className="row d-flex flex-grow-1 align-items-center m-3">
          <div className="col-5">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col">
            <Btn
              id="btn-buscarPorNombre"
              type="secondary"
              outline
              onClick={handleSearch}
            >
              Buscar
            </Btn>
          </div>
          <div className="col">
            <select
              className="form-select"
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Filtrar por</option>
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center">Cargando...</div>
        ) : facturas.length === 0 ? (
          <div className="text-center">No hay facturas</div>
        ) : (
          <div className="table-responsive m-3">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>N° Factura</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>RUC</th>
                  <th>Estado</th>
                  <th>Total(Gs)</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura, index) => (
                  <tr key={index}>
                    <td
                      className="py-2"
                      style={{
                        color: "#7749F8",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      <span onClick={() => showModal(factura)}>
                        {factura.factura.nroFactura}
                      </span>
                    </td>
                    <td className="py-2">{factura.factura.fecha}</td>
                    <td className="py-2">{factura.factura.nombreCliente}</td>
                    <td className="py-2">{factura.factura.rucCliente}</td>
                    <td className="py-3">
                      {factura.factura.pagado ? "Pagado" : "Pendiente"}
                    </td>
                    <td className="py-2">
                      {factura.factura.total.toLocaleString("es-ES")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="position-absolute bottom-0 start-50 translate-middle-x ">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
        {/* Muestra los detalles de la factura seleccionada */}
        {detalleFactura && (
          <>
            <DetalleFacturaModal
              factura={detalleFactura}
              closeModal={closeModal}
              open={modalOpen}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ListaVentas;
