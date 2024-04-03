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

    

    return { getFacturasPendientes, getFacturaById, error, notFound, isLoading }

}

export const useProductos = () => {
    const DIR = "/productos";

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const handleRequest = async (FuncionBackend) => {
        setIsLoading(true);
        try {
            const res = await FuncionBackend();
            return res.data;
        } catch (error) {
            if (error.response?.status === 404) {
                setNotFound(true);
            } else {
                setError(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getProductos = async () => {
        return handleRequest(async () => await api.get(`${DIR}`));
    };

    const getProductoById = async (id) => {
        return handleRequest(async () => await api.get(`${DIR}/${id}`));
    };

    return { getProductos, getProductoById, error, notFound, isLoading };
};

export const useProveedores = () => {
    const DIR = "/proveedores";

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const handleRequest = async (FuncionBackend) => {
        setIsLoading(true);
        try {
            const res = await FuncionBackend();
            return res.data;
        } catch (error) {
            if (error.response?.status === 404) {
                setNotFound(true);
            } else {
                setError(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getProveedores = async () => {
        return handleRequest(async () => await api.get(`${DIR}`));
    };

    const getProveedorById = async (id) => {
        return handleRequest(async () => await api.get(`${DIR}/${id}`));
    };

    return { getProveedores, getProveedorById, error, notFound, isLoading };
};