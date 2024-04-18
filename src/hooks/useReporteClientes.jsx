import { useState } from 'react'
import api from '../utils/api'

const useReporteClientes = () => {

    const RC_URL = '/clientes/reportes' //URL del endpoint

    const [data, setData] = useState([]); //datos traidos del back
    const [error, setError] = useState(null) //guarda error
    const [isLoadingMorosos, setIsLoadingMorosos] = useState(false) //guarda el estado de cargando

    const [isLoadingNewClients, setIsLoadingNewClients] = useState(false) //guarda el estado de cargando

    const handleRequest = async (FuncionBackend, loadingBool) => {
        setError(null)
        if (loadingBool === 'newClients') {
            setIsLoadingNewClients(true)
        } else if (loadingBool === 'morosos') {
            setIsLoadingMorosos(true)
        }
        //console.log("SE HA EJECUTADO UN FETCH, NO DEBERIAS VER ESTO SI USAS CACHE, " + FuncionBackend)
        try {
            const res = await FuncionBackend() // que funcion se ejecutara en el back
            setData(res.data) //guarda los datos traidos del back
            return res.data;
        } catch (error) {
            setError(error)
            return error
        } finally {
            if (loadingBool === 'newClients') {
                setIsLoadingNewClients(false)
            } else if (loadingBool === 'morosos') {
                setIsLoadingMorosos(false)
            }
        }
    }

    //Funciones del endpoint
    const getCantidadPorEstadoSuscripcion = async (params) => {
        return handleRequest(() => api.get(`${RC_URL}/cantidad-por-estado-suscripcion`, params), 'morosos')
    }

    const getNuevosClientesPorFechas = async (fechaInicio, fechaFin ,params) => {
        return handleRequest(() => api.get(`${RC_URL}/nuevos/${fechaInicio}/${fechaFin}`, params), 'newClients')
    }

    return { getCantidadPorEstadoSuscripcion, getNuevosClientesPorFechas, data, error, isLoadingMorosos, isLoadingNewClients }
}

export default useReporteClientes