import React, { createContext, useState, useContext } from "react";

const ArqueoContext = createContext();

export const useArqueoContext = () => useContext(ArqueoContext);

export const ArqueoProvider = ({ children }) => {
  const [arqueoData, setArqueoData] = useState(null);

  const saveArqueoData = (data) => {
    setArqueoData(data);
  };

  return (
    <ArqueoContext.Provider value={{ arqueoData, saveArqueoData }}>
      {children}
    </ArqueoContext.Provider>
  );
};
