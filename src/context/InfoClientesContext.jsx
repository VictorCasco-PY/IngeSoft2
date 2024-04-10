import { createContext, useContext, useState } from "react";
import useClienteData from "../hooks/useClientesData";
const InfoClientsContext = createContext();

export const InfoClientsProvider = ({ children }) => {
    const { cliente, setCliente, mediciones, setMediciones, pagos, setPagos } = useClienteData();

  return (
    <InfoClientsContext.Provider
      value={{ cliente, setCliente, mediciones, setMediciones, pagos, setPagos }}
    >
      {children}
    </InfoClientsContext.Provider>
  );
};

export const useInfoClients = () => useContext(InfoClientsContext);
