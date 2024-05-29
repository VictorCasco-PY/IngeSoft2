import { useState } from "react";
import api from "../utils/api";

export const useComprasProveedores = () => {
  const DIR = "/facturas-proveedores";

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const handleRequest = async (FuncionBackend) => {
    setIsLoading(true);
    setNotFound(false);
    try {
      const res = await FuncionBackend();
      if (res.data.items && res.data.items.length === 0) {
        setNotFound(true);
      }
      return res.data;
    } catch (error) {
      if (error.response?.status === 404) {
        setNotFound(true);
        setError("No se encontraron resultados.");
      } else {
        setError(error.toString());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFacturaById = async (id) => {
    return handleRequest(async () => await api.get(`${DIR}/${id}`));
  };

  const getFacturas = async (page = 1) => {
    return handleRequest(async () => await api.get(`${DIR}/page/${page}`));
  };

  const searchByNombreProveedor = async (nombre, page = 1) => {
    return handleRequest(
      async () => await api.get(`${DIR}/proveedor/${nombre}/page/${page}`)
    );
  };

  const searchByFecha = async (fechaInicio, fechaFin, page = 1) => {
    return handleRequest(
      async () =>
        await api.get(`${DIR}/${fechaInicio}/${fechaFin}/page/${page}`)
    );
  };

  const searchByRuc = async (ruc, page = 1) => {
    return handleRequest(
      async () => await api.get(`${DIR}/ruc/${ruc}/page/${page}`)
    );
  };

  const clearFilters = async (page = 1) => {
    return getFacturas(page);
  };

  return {
    getFacturaById,
    searchByNombreProveedor,
    searchByFecha,
    searchByRuc,
    getFacturas,
    clearFilters,
    isLoading,
    error,
    notFound,
  };
};
