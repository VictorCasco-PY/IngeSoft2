import React, { useState, useEffect } from "react";
import ButtonBasic from "../bottons/ButtonBasic";
import BotonCrear from "../bottons/ButtonCrear";
import ErrorPagina from "../../components/errores/ErrorPagina";
import { useComprasProveedores } from "../../hooks/useComprasProveedores";
import Pagination from "../../components/pagination/PaginationContainer";
import { ListaVacía } from "../errores/ListaVacía";
import CobrarProveedores from "../../pages/caja/comprasProveedores/facturas_ventas/CobrarProveedoresPendiente"; 
import { toast, Toaster } from 'react-hot-toast';
const TablaCaja = ({ items, totalPages, currentPage, onPageChange, mostrarFiltro }) => {
  const { searchByNombreCliente, getFacturas } = useComprasProveedores();
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [cobroModalOpen, setCobroModalOpen] = useState(false); 

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

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      getData();
      return;
    }
  };

  const handleSearch = async () => {
    if (search === "") {
      getData();
      return;
    }

    try {
      const res = await searchByNombreCliente(search);
      if (res && res.items) {
        setError(null); // Limpiar el estado de error si la solicitud es exitosa
      } else {
        setError("No se encontraron facturas con ese nombre."); // Mostrar mensaje si no se encuentran resultados
      }
    } catch (error) {
      setError("Ha ocurrido un error al buscar las facturas."); // Manejar errores de solicitud
    }
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
        <div className="card-body d-flex align-items-center ">
          <input
            id="input-search"
            className="form-control custom-input"
            type="text"
            placeholder="Buscar por proveedor..."
            onChange={handleSearchInput}
            value={search}
          />
          <ButtonBasic id="btn-buscar" text="Buscar" onClick={handleSearch} />
        </div>
        {mostrarFiltro && (
          <div className="col">
            <select className="form-select">
              <option value="">Filtrar por</option>
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        )}
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
          {items.map((item, index) => {
            const factura = item.factura || item; // Usar item si item.factura no está definido
            return (
              <tr key={index} onClick={() => handleRowClick(factura)}>
                <td style={{ color: "#6941C6" }}>{factura.nroFactura}</td>
                <td>{factura.fecha}</td>
                <td>{factura.nombreProveedor}</td>
                <td>{factura.rucProveedor}</td>
                <td>{factura.pagado ? "Pagado" : "Pendiente"}</td>
                <td>{factura.subTotal}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {error && <ListaVacía mensaje={error} />} {/* Mostrar mensaje de error si existe */}
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