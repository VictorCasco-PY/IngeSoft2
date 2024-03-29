import { useState } from 'react'
import api from '../utils/api'

const useSuscripcion = () => {

    const SUSCRIPCION_URL = '/suscripciones' //URL del endpoint

    const [data, setData] = useState([]); //datos traidos del back
    const [error, setError] = useState(null) //guarda error
    const [isLoading, setIsLoading] = useState(false) //guarda el estado de cargando

    const handleRequest = async (FuncionBackend) => {
        setIsLoading(true)
        try {
            const res = await FuncionBackend() // que funcion se ejecutara en el back
            setData(res.data) //guarda los datos traidos del back
            return res.data;
        } catch (error) {
            setError(error)
            return error
        } finally {
            setIsLoading(false)
        }
    }

    //Funciones del endpoint
    const getSuscripcionesByCliente = async (id, page = 1, params) => {
        return handleRequest(() => api.get(`${SUSCRIPCION_URL}/cliente/${id}/page/${page}`, params ))
    }

    return { getSuscripcionesByCliente, data, error, isLoading }
}

export default useSuscripcion