import { useState, useEffect } from 'react';
import api from '../utils/api';

const useSuscripciones = () => {
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSuscripciones = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/suscripciones/mis-suscripciones/page/${currentPage}`);
        const { items, totalPages } = response.data;
        setSuscripciones(items);
        setTotalPages(totalPages);
        setLoading(false);
        console.log(suscripciones);
      } catch (error) {
        console.error('Error al obtener las suscripciones:', error);
        setLoading(false);
      }
    };

    fetchSuscripciones();
  }, [currentPage]);

  return { suscripciones, loading, totalPages, currentPage, setCurrentPage };
};

export default useSuscripciones;
