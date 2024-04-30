import { useState } from "react";
import api from "../utils/api";

const useArqueo = () => {
  const ARQUEO_URL = "/arqueo";

  const [arqueos, setArqueos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async (funcionBackend) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await funcionBackend();
      setArqueos(res.data.items);
      setTotalPages(res.totalPages);
      return res.data.items;
    } catch (error) {
      setError(error);
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  const getArqueos = async (page = 1, params) => {
    return handleRequest(() => api.get(`${ARQUEO_URL}/page/${page}`, params));
  };

  return { getArqueos, arqueos, totalPages, error, isLoading };
};

export default useArqueo;
