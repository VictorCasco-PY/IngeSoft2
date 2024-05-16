import { useEffect, useState } from 'react';
import api from '../utils/api';

const useMedicionesCliente = () => {
    const [mediciones, setMediciones] = useState([]); // Lista acumulativa de todas las mediciones
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchMedicionesCliente = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/mediciones/mis-mediciones/page/${currentPage}`);
                const { items, totalPages } = response.data;
                
                // Filtrar mediciones para eliminar duplicados por fecha
                const uniqueMediciones = items.reduce((acc, medicion) => {
                    const existingMedicion = acc.find(item => item.fecha === medicion.fecha);
                    if (!existingMedicion) {
                        acc.push(medicion);
                    }
                    return acc;
                }, []);

                setMediciones(prevMediciones => [...prevMediciones, ...uniqueMediciones]);
                setTotalPages(totalPages);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener las mediciones:', error);
                setLoading(false);
            }
        };

        fetchMedicionesCliente();
    }, [currentPage]);

    return { mediciones, loading, totalPages, currentPage, setCurrentPage };
};

export default useMedicionesCliente;
