import React, { createContext, useState, useEffect } from "react";
import api from "../../../utils/api";
import ComprasCaja from "../../caja/comprasProveedores/ComprasCaja";
import ListaCompras from "../../caja/comprasProveedores/ListaCompras";



export const ComprasCajaContext = createContext();

export const ComprasProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [facturasProveedores, setFacturasProveedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  
  const guardarFormulario = async () => {
    try {
      // Guardar el producto en la API de productos
      const nuevoProducto = await api.post("/productos/page/1", {
        nombre: formulario.items[0].producto,
        precio: formulario.items[0].precioUnitario,
      });
  
      // Guardar la factura en la API de facturas-proveedores
      const nuevaFactura = await api.post("/facturas-proveedores/page/1", {
        fecha: formulario.fecha,
        modalidadPago: formulario.modalidadPago,
        proveedor: formulario.ruc,
        items: formulario.items,
      });
    } catch (error) {
      setError(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          productosResponse,
          proveedoresResponse,
          facturasProveedoresResponse,
        ] = await Promise.all([
          api.get("/productos"),
          api.get("/proveedores"),
          api.get("/facturas-proveedores"),
        ]);

        setProductos(productosResponse.data);
        setProveedores(proveedoresResponse.data);
        setFacturasProveedores(facturasProveedoresResponse.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ComprasCajaContext.Provider
      value={{
        productos,
        proveedores,
        facturasProveedores,
       
        isLoading,
        error,
      }}
    >
      {children}
      <ComprasCaja/>
      <ListaCompras/>
    </ComprasCajaContext.Provider>
  );
};
