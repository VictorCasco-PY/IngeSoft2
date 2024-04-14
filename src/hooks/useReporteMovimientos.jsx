import { useState } from 'react'
import api from '../utils/api'

const useReporteMovimientos = () => {

    const RC_URL = '/movimientos/reportes' //URL del endpoint

    const [data, setData] = useState([]); //datos traidos del back
    const [error, setError] = useState(null) //guarda error
    const [isLoading, setIsLoading] = useState(false) //guarda el estado de cargando

    const handleRequest = async (FuncionBackend) => {
        setError(null)
        setIsLoading(true)
        //console.log("SE HA EJECUTADO UN FETCH, NO DEBERIAS VER ESTO SI USAS CACHE, " + FuncionBackend)
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
    const getIngresoTotalPorFecha = async (params, fechaInicio, fechaFin) => {
        return handleRequest(() => api.get(`${RC_URL}/ingresos/${fechaInicio}/${fechaFin}`, params))
    }
    return { getIngresoTotalPorFecha, data, error, isLoading }
}

export default useReporteMovimientos