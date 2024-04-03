import { useState } from 'react'
import api from '../utils/api'

const useCaja = () => {

    const CAJA_URL = '/cajas' //URL del endpoint

    const [data, setData] = useState([]); //datos traidos del back
    const [error, setError] = useState(null) //guarda error
    const [isLoading, setIsLoading] = useState(false) //guarda el estado de cargando

    const [noCajasError, setNoCajasError] = useState(null) //guarda error 404

    const handleRequest = async (FuncionBackend) => {
        setError(null)
        setIsLoading(true)
        setNoCajasError(null)
        try {
            const res = await FuncionBackend() // que funcion se ejecutara en el back
            setData(res.data) //guarda los datos traidos del back
            return res.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setNoCajasError(error.response.data.message)
            }
            setError(error)
            return error
        } finally {
            setIsLoading(false)
        }
    }

    //Funciones del endpoint
    const createCaja = async params => {
        return handleRequest(() => api.post(CAJA_URL, params ))
    }

    const getCajaById = async (id, params) => {
        return handleRequest(() => api.get(`${CAJA_URL}/${id}`, params ))
    }

    const searchCajaByName = async (nombre, page = 1, params) => {
        return handleRequest(() => api.get(`${CAJA_URL}/search/${nombre}/page/${page}`, params ))
    }

    const getAllCajas = async (page = 1, params) => {
        return handleRequest(() => api.get(`${CAJA_URL}/page/${page}`, params ))
    }

    return { createCaja, getCajaById, searchCajaByName, getAllCajas, data, error, noCajasError, isLoading }
}

export default useCaja