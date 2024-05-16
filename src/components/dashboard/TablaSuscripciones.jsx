import React, { useState, useEffect } from "react";
import Pagination from "../pagination/PaginationContainer";
import  useSuscripciones  from "../../hooks/useSuscripcionesDash";
import ErrorPagina from "../errores/ErrorPagina";
import CircularProgress from "@mui/material/CircularProgress";
import EstadoPago from "../estado_pago/EstadoPago";

const TablaSuscripciones = () => {
  const { suscripciones, loading, totalPages, currentPage, setCurrentPage } = useSuscripciones(); 
    return (
    <>
      {loading ? (
        <CircularProgress />
      ) : suscripciones.length === 0 ? (
        <ErrorPagina mensaje="No hay suscripciones disponibles" />
      ) : (
        <>
          <table className="custom-table mt-3">
            <thead>
              <tr>
                <th scope="col"><strong>Suscripciones</strong></th>
                <th scope="col"><strong>Modalidad</strong></th>
                <th scope="col"><strong>Estado</strong></th>
              </tr>
            </thead>
            <tbody>
              {suscripciones.map((suscripcion) => (
                <tr key={suscripcion.id}>
                  <td ><strong>{suscripcion.actividadNombre}</strong></td>
                  <td>{suscripcion.modalidad}</td>
                  <td> <EstadoPago
                      estado={
                        suscripcion.estado ? suscripcion.estado.toLowerCase() : ""
                      }
                    /></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-center mt-4">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TablaSuscripciones;
