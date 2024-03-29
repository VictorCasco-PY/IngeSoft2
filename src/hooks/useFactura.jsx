import { useState } from "react";
import api from "../utils/api";

export const useFactura = () => {

    const DIR = "/facturas"

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

    const getFacturasPendientes = async (page = 1) => {
        return handleRequest(async () => await api.get(`${DIR}/estado/pendiente/page/${page}`))
    }

    return { getFacturasPendientes, error, notFound, isLoading }

}