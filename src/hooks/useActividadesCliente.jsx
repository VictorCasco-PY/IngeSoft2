import { useState, useEffect } from "react";
import api from "../utils/api";

const useActividadesCliente = (initialPage = 1) => {
  const [actividades, setActividades] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActividades = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/actividades/entrenadores/page/${currentPage}`
        );
        if (response.data && response.data.items) {
          const fetchedActividades = response.data.items.map((item) => ({
            ...item.actividad,
            entrenadoresNombres:
              item.entrenadores?.map((ent) => ent.nombre).join(", ") ||
              "No asignados",
          }));
          console.log("fetch ", fetchedActividades);
          setActividades(fetchedActividades);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
        } else {
          setError("No se encontraron actividades.");
        }
        setIsLoading(false);
      } catch (error) {
        setError("Error al cargar actividades: " + error.message);
        setIsLoading(false);
        console.error("Error al obtener actividades", error);
      }
    };

    fetchActividades();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleActividadClick = (actividad) => {
    setSelectedActividad(actividad);
  };

  return {
    actividades,
    totalPages,
    currentPage,
    selectedActividad,
    isLoading,
    error,
    handlePageChange,
    handleActividadClick,
  };
};

export default useActividadesCliente;
