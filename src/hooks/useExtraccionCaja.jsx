import { useState } from 'react';
import api from '../utils/api';

const useExtraccionCaja = () => {
    const EXTRACCION_URL = '/cajas/extraccion';

    const [isLoading, setIsLoading] = useState(false); // Estado para indicar si se esta realizando la extraccion
    const [error, setError] = useState(null); 

    // funcion para realizar la extraccion
    const realizarExtraccion = async (extraccionData) => {
        setIsLoading(true); 

        try {
            const res = await api.post(EXTRACCION_URL, extraccionData); 
            return res.data; 
        } catch (error) {
            setError(error); 
            throw error; 
        } finally {
            setIsLoading(false); 
        }
    };

    return { realizarExtraccion, isLoading, error }; 
};

export default useExtraccionCaja;
