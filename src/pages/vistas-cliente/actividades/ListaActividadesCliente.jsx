import React from "react";
import useActividadesCliente from "../../../hooks/useActividadesCliente";
import Pagination from "../../../components/pagination/PaginationContainer";

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
          <p>Cargando actividades...</p>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="row">
        {actividades.map((actividad) => (
          <div
            className="col-12 col-md-6 col-lg-4 mb-3"
            key={actividad.actividad.id}
            onClick={() => handleActividadClick(actividad.actividad)}
          >
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{actividad.actividad.nombre}</h5>
                <p className="card-text">
                  {actividad.clientes} clientes inscritos
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedActividad && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedActividad.nombre}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => handleActividadClick(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{selectedActividad.descripcion}</p>
                <p>Costo mensual: {selectedActividad.costoMensual}</p>
                <p>Costo semanal: {selectedActividad.costoSemanal}</p>
                <p>
                  Entrenadores:{" "}
                  {selectedActividad.entrenadores.length > 0
                    ? selectedActividad.entrenadores.join(", ")
                    : "No asignados"}
                </p>
              </div>
            </div>
          </div>
        </div>
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
