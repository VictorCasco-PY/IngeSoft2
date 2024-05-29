import React, { useState, useEffect } from "react";
import ButtonBasic from "../bottons/ButtonBasic";
import { useComprasProveedores } from "../../hooks/useComprasProveedores";
import Pagination from "../../components/pagination/PaginationContainer";
import { ListaVacía } from "../errores/ListaVacía";
import CobrarProveedores from "../../pages/caja/comprasProveedores/facturas_ventas/CobrarProveedoresPendiente";
import { toast, Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatFecha } from "../../utils/Formatting";
import { precioHandler } from "../../utils/precioHandler";
import { Btn } from "../bottons/Button";

const TablaCaja = ({
  items,
  totalPages,
  currentPage,
  onPageChange,
  mostrarFiltro,
}) => {
  const {
    getFacturas,
    searchByRuc,
    searchByNombreProveedor,
    searchByFecha,
    clearFilters,
    notFound,
  } = useComprasProveedores();
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cobroModalOpen, setCobroModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getData = async (page = 1) => {
    try {
      const response = await getFacturas(page);
      if (response && response.items) {
        setError(null); // Limpiar el estado de error si la solicitud es exitosa
      }
    } catch (error) {
      setError("Ha ocurrido un error cargando los datos."); // Manejar errores de solicitud
    }
  };

  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const handleSearch = async () => {
    // Primero verifica si los campos de fecha están seteados
    if (startDate && endDate) {
      // Realiza la búsqueda por fecha
      await searchByFecha(startDate, endDate);
    } else {
      // Si no hay fechas, verifica si el campo de búsqueda tiene contenido
      if (search) {
        if (!isNaN(search)) {
          // Realiza la búsqueda por RUC
          await searchByRuc(search);
        } else {
          // Realiza la búsqueda por nombre
          await searchByNombreProveedor(search);
        }
      } else {
        // Si no hay fechas ni búsqueda de texto, obtén todas las facturas
        await getFacturas();
      }
    }
  };

  const handleClearFilters = async () => {
    setSearch("");
    setStartDate(null);
    setEndDate(null);
    await clearFilters();
  };

  const handleRowClick = (factura) => {
    if (!factura.pagado) {
      setSelectedItem(factura);
      setCobroModalOpen(true);
    } else {
      toast.error("Esta factura ya ha sido pagada");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex flex-grow-1 gap-2">
          <input
            type="date"
            className="form-control "
            value={startDate ? startDate : ""}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Desde..."
          />
          <input
            type="date"
            className="form-control "
            value={endDate ? endDate : ""}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Hasta..."
          />
          <input
            type="text"
            className="form-control "
            placeholder="Buscar por nombre o RUC..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <select className="form-select me-3">
            <option value="">Estado...</option>
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>
        <Btn type="secondary" outline onClick={handleSearch}>
          Buscar
        </Btn>
        <Btn onClick={handleClearFilters}>Limpiar</Btn>
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
        <tbody>
          {notFound ? (
            <tr>
              <td colSpan="6">
                <ListaVacía mensaje="No se encontraron facturas." />
              </td>
            </tr>
          ) : (
            items.map((item, index) => {
              const factura = item.factura || item; // Usar item si item.factura no está definido
              return (
                <tr key={index} onClick={() => handleRowClick(factura)}>
                  <td style={{ color: "#6941C6" }}>{factura.nroFactura}</td>
                  <td>{formatFecha(factura.fecha)}</td>
                  <td>{factura.nombreProveedor}</td>
                  <td>{factura.rucProveedor}</td>
                  <td>{factura.pagado ? "Pagado" : "Pendiente"}</td>
                  <td>{precioHandler(factura.subTotal)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {error && <ListaVacía mensaje={error} />}{" "}
      {/* Mostrar mensaje de error si existe */}
      <div className="pagination-container">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      {cobroModalOpen && selectedItem && (
        <CobrarProveedores
          factura={selectedItem}
          closeModal={() => setCobroModalOpen(false)}
          open={cobroModalOpen}
          toast={toast}
        />
      )}
    </div>
  );
};

export default TablaCaja;
