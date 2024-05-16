import { useEffect, useState } from 'react';
import api from '../utils/api';

const useProgramasEntrenador = (entrenadorId) => {
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchProgramasEntrenador = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/programas/empleado/${entrenadorId}/page/${currentPage}`);
                const { items, totalPages } = response.data;

                setProgramas(prevProgramas => [...prevProgramas, ...items]);
                setTotalPages(totalPages);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los programas:', error);
                setLoading(false);
            }
        };

        if (entrenadorId) {
            fetchProgramasEntrenador();
        }
    }, [entrenadorId, currentPage]);

    return { programas, loading, totalPages, currentPage, setCurrentPage };
};

export default useProgramasEntrenador;
