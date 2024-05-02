import { useState } from "react";
import api from "../utils/api";

export const usePlanes = () => {
  const DIR = "/programas";
  const Actividades = "/actividades";
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const handleRequest = async (FuncionBackend) => {
    setIsLoading(true);
    try {
      const res = await FuncionBackend();
      return res.data;
    } catch (error) {
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  //Creamos un programa
  const crearProgramas = async (programa) => {
    return handleRequest(async () => await api.post(`${DIR}`, programa));
  };
  //Obtenemos los programas
  const getProgramas = async (page = 1) => {
    setIsLoading(true);
    const res = handleRequest(async () => await api.get(`${DIR}/page/${page}`));
    setIsLoading(false);
    return res;
  };
  //Obtenemos los programas filtrados por nivel
  const getProgramasPrincipiantes = async (page = 1, titulo = "") => {
    setIsLoading(true);
    const res = handleRequest(
      async () =>
        await api.get(`${DIR}/page/${page}`, {
          params: { nivel: "PRINCIPIANTE", titulo },
        })
    );
    setIsLoading(false);
    return res;
  };

  const getProgramasIntermedio = async (page = 1, titulo = "") => {
    setIsLoading(true);
    const res = handleRequest(
      async () =>
        await api.get(`${DIR}/page/${page}`, {
          params: { nivel: "INTERMEDIO", titulo },
        })
    );
    setIsLoading(false);
    return res;
  };
  //Obtenemos los programas filtrados por nivel
  const getProgramasAvanzado = async (page = 1, titulo = "") => {
    setIsLoading(true);
    const res = handleRequest(
      async () =>
        await api.get(`${DIR}/page/${page}`, {
          params: { nivel: "AVANZADO", titulo },
        })
    );
    setIsLoading(false);
    return res;
  };
  //Obtenemos las actividades
  const getActividades = async (page = 1) => {
    setIsLoading(true);
    const res = handleRequest(
      async () => await api.get(`${Actividades}/page/${page}`)
    );
    setIsLoading(false);
    return res;
  };
  //Obtenemos el programa por id
  const getProgramasById = async (id, params) => {
    setIsLoading(true);
    const res = handleRequest(
      async () => await api.get(`${DIR}/${id}`, params)
    );
    setIsLoading(false);
    return res;
  };
  //Obtenemos los programas filtrados por nivel y actividad
  const getProgramasByActividad = async (nivel, nombreActividad, page = 1) => {
    setIsLoading(true);
    const res = handleRequest(
      async () =>
        await api.get(`${DIR}/page/${page}`, {
          params: { nivel, nombreActividad },
        })
    );
    setIsLoading(false);
    return res;
  };
  return {
    crearProgramas,
    getProgramas,
    getActividades,
    getProgramasPrincipiantes,
    getProgramasIntermedio,
    getProgramasAvanzado,
    getProgramasById,
    getProgramasByActividad,
  };
};
