import { useState } from "react";
import api from "../utils/api";

export const useComprasProveedores = () => {

    const DIR = "/facturas-proveedores"

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

    const getFacturaById = async (id) => {
        return handleRequest(async () => await api.get(`${DIR}/${id}`))
    }

    const getFacturas= async ( page = 1) => {
        return handleRequest(async () => await api.get(`${DIR}/page/${page}`))
    }
    const searchByNombreCliente = async (nombre, page = 1)=>{
        return handleRequest(async ()=> await api.get(`${DIR}/proveedor/${nombre}/page/${page}`))
    }

    return { getFacturaById, searchByNombreCliente,getFacturas}

}

