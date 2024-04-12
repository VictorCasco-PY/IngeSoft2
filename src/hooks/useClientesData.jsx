import { useState } from "react";
import api from "../utils/api";

const useClienteData = (id) => {
  const InfoClientes_URL = "/clientes"; //URL del endpoint
  const Mediciones_URL = "/mediciones";

  const [cliente, setCliente] = useState(null);
  const [actualizar, setActualizarCliente] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [mediciones, setMediciones] = useState([]);
  const [data, setData] = useState([]); //datos traidos del back
  const [error, setError] = useState(null); //guarda error
  const [isLoading, setIsLoading] = useState(false); //guarda el estado de cargando

  const [noClientesError, setNoClientesError] = useState(null); //guarda error 404

  const handleRequest = async (FuncionBackend) => {
    setError(null);
    setIsLoading(true);
    setNoClientesError(null);
    try {
      const res = await FuncionBackend(); // que función se ejecutará en el back
      setData(res.data); // guarda los datos traídos del back
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setNoClientesError(error.response.data.message);
      }
      setError(error);
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  //Funciones del endpoint
  //Obtiene un cliente por id
  const getClienteById = async (id, params) => {
    return handleRequest(() => api.get(`${InfoClientes_URL}/${id}`, params));
  };

  //Actualiza los nuevos valores del cliente
  const actualizarCliente = async(id, params) => {
    return handleRequest(() => api.put(`${InfoClientes_URL}/${id}`, params))
  }
  //Crea una nueva medicion
  const crearMedicion = async (id, params) => {
    return handleRequest(() => api.post(`${Mediciones_URL}`, params))
  }
  
  // Obtiene la medición de un cliente por id y página
  const getMedicionClienteById = async (id, page = 1, params) => {
    return handleRequest(() =>
      api.get(`${Mediciones_URL}/searchByClienteId/${id}/page/${page}`, params)
    );
  };
  //Eliminar una medicion
  const eliminarMedicion = async (id, params) =>{
    return handleRequest(() =>
      api.delete(`${Mediciones_URL}/${id}`, params)
  );
  }
  //Endpoint para obtener los pagos del cliente
 // Obtiene los pagos del cliente por id y página
const getPagosClienteById = async (id, page = 1, params) => {
  return handleRequest(() =>
    api.get(`${InfoClientes_URL}/id/${id}/page/${page}`, params)
  );
};


  return {
    cliente,
    mediciones,
    setCliente,
    setMediciones,
    getClienteById,
    setActualizarCliente,
    getMedicionClienteById,
    crearMedicion,
    eliminarMedicion,
    getPagosClienteById,
    pagos,
    setPagos,
    data,
    error,
    noClientesError,
    isLoading,
    actualizarCliente,
  };
};

export default useClienteData;
