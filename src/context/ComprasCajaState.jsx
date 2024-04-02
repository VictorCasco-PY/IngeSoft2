import { createContext, useContext, useReducer } from "react";
import ComprasCajaReducer from "./ComprasCajaReducer";
import ComprasCaja from '../pages/caja/comprasProveedores/ComprasCaja';
import ListaCompras from '../pages/caja/comprasProveedores/ListaCompras';
import { useLocation } from 'react-router-dom';
import api from "../utils/api";

const initialState = {
  items: [],
};

export const Context = createContext();

export const useComprasCaja = () => {
  const context = useContext(Context);
  return context;
};

export const ComprasCajaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ComprasCajaReducer, initialState);

  const addItem = (item) => {
    dispatch({
      type: "ADD_ITEM",
      payload: item,
    });
  };

  const generarFacturaYActualizarProductos = async (items) => {
    
  };

  const guardarFacturaProveedor = async (formData) => {
    try {
      // Aquí debes construir el objeto de factura con la información necesaria
      // y enviarlo a la API de facturas-proveedores para guardar la factura
      await api.post('/facturas-proveedores', formData);

      console.log("Factura proveedor guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar la factura proveedor:", error);
      // Manejo de errores
    }
  };

  const location = useLocation();
  const isComprasCaja = location.pathname === '/comprasCaja';

  return (
    <Context.Provider value={{ items: state.items, addItem, generarFacturaYActualizarProductos, guardarFacturaProveedor }}>
      {children}
      {isComprasCaja ? <ComprasCaja /> : <ListaCompras />}
    </Context.Provider>
  );
};