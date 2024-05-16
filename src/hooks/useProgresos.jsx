import { useEffect, useState } from 'react';
import api from '../utils/api';

const useProgresos = () => {
    const [progresos, setProgresos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchProgresos = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/programas/mis-progresos/page/${currentPage}`);
                const { items, totalPages } = response.data;
                setProgresos(items);
                
                setTotalPages(totalPages);
                setLoading(false);
                console.log(progresos);
            } catch (error) {
                console.error('Error al obtener los progresos:', error);
                setLoading(false);
            }
        };

        fetchProgresos();
    }, [currentPage]);

    return { progresos, loading, totalPages, currentPage, setCurrentPage };
};

export default useProgresos;
