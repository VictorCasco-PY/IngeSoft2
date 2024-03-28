import { useState } from "react";
import api from "../utils/api";

export const useFactura = () =>{

    const DIR = "/facturas"

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const handleRequest = async (FuncionBackend) => {
        setIsLoading(true)
        try {
            const res = await FuncionBackend()
            setData(res.data)
            return res.data
        } catch (error) {
            setError(error)
            return error
        } finally {
            setIsLoading(false)
        }
    }

    const getFacturasPendientes = async (page = 1) => {
        return handleRequest(() => api.get(`${DIR}/estado/pendiente/page/${page}`))
    }

    return { getFacturasPendientes, error, isLoading }

}