import { useState } from 'react'
import api from '../utils/api'

const useReporteClienteNuevo = () => {

    const RC_URL = '/clientes/nuevos' //URL del endpoint

    const [data, setData] = useState([]); //datos traidos del back
    const [error, setError] = useState(null) //guarda error

    const [isLoadingNewClients, setIsLoadingNewClients] = useState(false) //guarda el estado de cargando

 const handleRequest = async (requestFunction) => {
        setError(null);
        setIsLoadingNewClients(true); // Establece isLoadingNewClients a true durante la solicitud
        try {
            const res = await requestFunction();
            setData(res.data);
            return res.data;
        } catch (error) {
            setError(error);
            return error;
        } finally {
            setIsLoadingNewClients(false); 
        }
    };

    // para obtener nuevos clientes por fechas
    const getNuevosClientesPorFechas = async (fechaInicio, fechaFin, page, params) => {
        return handleRequest(() => api.get(`${RC_URL}/${fechaInicio}/${fechaFin}/page/${page}`, params))
    }

    return { getNuevosClientesPorFechas, data, error, isLoadingNewClients };
}

export default useReporteClienteNuevo;