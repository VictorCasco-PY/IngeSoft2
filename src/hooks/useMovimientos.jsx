import { useState } from "react";
import api from "../utils/api";

export const useMovimientos = () => {

    const DIR = "/movimientos"

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)



    const handleRequest = async (FuncionBackend) => {
        setIsLoading(true)
        try {
            const res = await FuncionBackend()
            return res.data
        } catch (error) {
            if (error.response?.status === 404) {
                setNotFound(true)
            }
            else {
                setError(error)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const getMovimientos = async (page=1) => {
        return handleRequest(async () => await api.get(`${DIR}/page/${page}`))
    }

    const getMovimientoPorId = async (id) => {
        return handleRequest(async () => await api.get(`${DIR}/${id}`))
    }

    const crearMovimiento = async (movimiento) => {
        return handleRequest(async () => await api.post(`${DIR}`, movimiento))
    }

    return { crearMovimiento, getMovimientos, getMovimientoPorId, error, notFound, isLoading }

}