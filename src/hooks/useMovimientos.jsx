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

    const crearMovimiento = async (movimiento) => {
       try{
        return handleRequest(async () => await api.post(`${DIR}`, movimiento))
       } catch(error) {
        setError(error)
       }
    }

    return { crearMovimiento, error, notFound, isLoading }

}