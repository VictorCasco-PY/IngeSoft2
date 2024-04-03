import { createContext, useContext, useReducer } from "react";
import ComprasCajaReducer from "./ComprasCajaReducer";
import ComprasCaja from "../pages/caja/comprasProveedores/ComprasCaja";
import ListaCompras from "../pages/caja/comprasProveedores/ListaCompras";
import { useLocation } from "react-router-dom";
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

  return (
    <Context.Provider value={{ items: state.items, addItem }}>
      {children}
    </Context.Provider>
  );
};
