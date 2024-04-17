import React, { useState } from "react";
import api from "../utils/api";
import CajaStorage from "../utils/CajaStorage";

const useArqueo = () => {
  const ARQUEO_URL = "/arqueo";

  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getArqueoBySesionId = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.get(
        ARQUEO_URL + `/${CajaStorage.getSesionCajaId}`
      );
      setData(response.data);
      return response.data;
    } catch (error) {
      setError(error);
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  return { getArqueoBySesionId, data, isLoading };
};

export default useArqueo;
