import React, { useState, useEffect } from "react";
import ButtonBasic from "../bottons/ButtonBasic";
import BotonCrear from "../bottons/ButtonCrear";
import ErrorPagina from "../../components/errores/ErrorPagina";
import { useComprasProveedores } from "../../hooks/useComprasProveedores";
import Pagination from "../../components/pagination/PaginationContainer";
import { ListaVacía } from "../errores/ListaVacía";

const TablaCaja = ({ items, totalPages, currentPage, onPageChange }) => {
  const [data, setData] = useState([]);
  const { searchByNombreCliente, getFacturas } = useComprasProveedores();
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const getData = async (page = 1) => {
    try {
      const response = await getFacturas(page);
      if (response && response.items) {
        setData(response.items);
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
        setData(res.items);
        setError(null); // Limpiar el estado de error si la solicitud es exitosa
      } else {
        setData([]);
        setError("No se encontraron facturas con ese nombre."); // Mostrar mensaje si no se encuentran resultados
      }
    } catch (error) {
      setError("Ha ocurrido un error al buscar las facturas."); // Manejar errores de solicitud
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
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
          {data.map((item, index) => {
            const factura = item.factura || item; // Usar item si item.factura no está definido
            return (
              <tr key={index}>
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
    </div>
  );
};

export default TablaCaja;
