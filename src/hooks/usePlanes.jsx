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

  // Creamos un ejercicio en un programa
  const crearEjercicios = async (id, ejercicio) => {
    return handleRequest(async () =>
      api.post(`${DIR}/${id}/items`, ejercicio)
    );
  };
 
// Obtenemos los ejercicios de un programa por su ID
// Obtenemos los ejercicios de un programa por su ID
const getEjerciciosByProgramaId = async (id,programaId, page = 1) => {
  setIsLoading(true);
  try {
    const res = await handleRequest(
      async () =>
        await api.get(`${DIR}/${id}/items/page/${page}`)
    );
    setIsLoading(false);
    return res;
  } catch (error) {
    console.error("Error al obtener ejercicios del programa:", error);
    setErrorMessage("Ha ocurrido un error al obtener los ejercicios.");
    setIsLoading(false);
    throw error;
  }
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
  const getProgramasById = async (id) => {
    setIsLoading(true);
    try {
      return handleRequest(async () => await api.get(`${DIR}/${id}`));
    } catch {
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(error);
      }
    } finally {
      setIsLoading(false);
    }
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
  
  const eliminarPrograma = async (id, params) =>{
    return handleRequest(() =>
      api.delete(`${DIR}/${id}`, params)
  );
  }
  const eliminarEjercicio = async (idPrograma, idItem) => {
    try {
      const response = await api.delete(`${DIR}/${idPrograma}/items/${idItem}`);
      return response.items;
    } catch (error) {
      console.error('Error eliminando ejercicio:', error);
      throw error;
    }
  };
  //Actualiza los nuevos valores del cliente
  const actualizarPrograma = async(id, params) => {
    return handleRequest(() => api.put(`${DIR}/${id}`, params))
  }
  //Actualiza los nuevos valores del cliente
  const actualizarEjercicios = async(id, idItem) => {
    return handleRequest(() => api.put(`${DIR}/${id}/items/${idItem}`))
  }
  return {
    crearProgramas,
    eliminarEjercicio,
    eliminarPrograma,
    getEjerciciosByProgramaId,
    crearEjercicios,
    getProgramas,
    getActividades,
    getProgramasPrincipiantes,
    getProgramasIntermedio,
    getProgramasAvanzado,
    getProgramasById,
    getProgramasByActividad,
    actualizarPrograma,
    actualizarEjercicios
  };
};
