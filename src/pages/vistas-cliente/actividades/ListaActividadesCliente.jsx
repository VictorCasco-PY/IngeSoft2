import React from "react";
import useActividadesCliente from "../../../hooks/useActividadesCliente";
import Pagination from "../../../components/pagination/PaginationContainer";
import ActividadCard from "./ActividadCard";
import ActividadModal from "./ActividadModal";
import { CircularProgress } from "@mui/material";

const ListaActividadesCliente = () => {
  const {
    actividades,
    totalPages,
    currentPage,
    selectedActividad,
    isLoading,
    error,
    handlePageChange,
    handleActividadClick,
  } = useActividadesCliente();

  return (
    <div className="container">
      {isLoading && (
        <div className="text-center">
          <CircularProgress />
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <h1>Lista de actividades</h1>
      <div className="row">
        {actividades.map((actividad) => (
          <ActividadCard
            key={actividad.actividad.id}
            actividad={actividad.actividad}
            onClick={handleActividadClick}
          />
        ))}
      </div>
      {selectedActividad && (
        <ActividadModal
          actividad={selectedActividad}
          onClose={() => handleActividadClick(null)}
        />
      )}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ListaActividadesCliente;
