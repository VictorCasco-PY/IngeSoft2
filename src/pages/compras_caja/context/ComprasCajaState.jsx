import { createContext, useContext, useReducer } from "react";
import ComprasCajaReducer from "./ComprasCajaReducer";
import ComprasCaja from '../ComprasCaja';
import ListaCompras from '../ListaCompras';
import { useLocation } from 'react-router-dom';
import api from "../../../utils/api";

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
    try {
      // Construir el objeto de factura con los detalles necesarios
      const factura = {
        proveedorId: 1, // ID del proveedor
        timbrado: "123456",
        nroFactura: "001-001-00000001",
        nombreProveedor: "Monster",
        rucProveedor: "121686-2",
        fecha: "2024-03-16",
        subTotal: 0,
        iva5: 0,
        iva10: 0,
        total: 0,
        saldo: 0,
        pagado: false,
      };

      // Calcular los totales de la factura
      for (const item of items) {
        factura.subTotal += parseFloat(item.subtotal);
        if (item.iva === 0.05) {
          factura.iva5 += parseFloat(item.ivaTotal);
        } else if (item.iva === 0.10) {
          factura.iva10 += parseFloat(item.ivaTotal);
        }
      }
      factura.total = factura.subTotal + factura.iva5 + factura.iva10;
      factura.saldo = factura.total;

      // Construir el objeto de detalles de la factura
      const detalles = items.map((item) => ({
        productoId: item.productoId,
        precioUnitario: parseFloat(item.precioUnitario),
        cantidad: parseInt(item.cantidad),
        subtotal: parseFloat(item.subtotal),
        iva: parseFloat(item.iva),
        ivaTotal: parseFloat(item.ivaTotal),
      }));

      // Enviar la solicitud para guardar la factura en la API de facturas-proveedores
      await api.post('/facturas-proveedores', {
        factura: factura,
        detalles: detalles,
      });

      console.log("Factura generada y detalles guardados exitosamente");
    } catch (error) {
      console.error("Error al generar factura y guardar detalles:", error);
      // Manejo de errores
    }
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