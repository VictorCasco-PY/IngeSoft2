import { useState } from 'react'
import api from '../utils/api'

const useSesionCaja = () => {

    const CAJA_URL = '/cajas/sesiones-caja' //URL del endpoint

    const [data, setData] = useState([]); //datos traidos del back
    const [error, setError] = useState(null) //guarda error
    const [isLoading, setIsLoading] = useState(false) //guarda el estado de cargando

    const [error400, setError400] = useState(null) //guarda error 400

    const handleRequest = async (FuncionBackend) => {
        setError(null)
        setIsLoading(true)
        setError400(null)
        try {
            const res = await FuncionBackend() // que funcion se ejecutara en el back
            setData(res.data) //guarda los datos traidos del back
            return res.data;
        } catch (error) {
            if (error.response && error.response.status === 400) {    
                setError400(error.response.data.message)
                console.log(error400)
            }
            setError(error)
            return error
        } finally {
            setIsLoading(false)
        }
    }

    //Funciones del endpoint
    const getSesionCajaById = async (id, params) => {
        return handleRequest(() => api.get(`${CAJA_URL}/${id}`, params ))
    }

    const createSesionCaja = async params => {
        return handleRequest(() => api.post(CAJA_URL, params))
    }

    const cerrarCajaById = async (id, params) => {
        return handleRequest(() => api.put(`${CAJA_URL}/${id}`, params))
    }

    return { getSesionCajaById, createSesionCaja, cerrarCajaById, data, error, error400, isLoading }
}

export default useSesionCaja