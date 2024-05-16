import React from "react";

const ActividadCard = ({ actividad, onClick }) => {
  
  const sanitizedNombre = actividad.nombre.replace(/\s+/g, '-').toLowerCase();

  return (
    <div
      className="col-12 col-md-6 col-lg-4 mb-3"
      onClick={() => onClick(actividad)}
    >
      <div className="card" id={`card-${sanitizedNombre}`}>
        <div className="card-body">
          <h5 className="card-title">{actividad.nombre}</h5>
          <p className="card-text">{actividad.descripcion}</p>
        </div>
      </div>
    </div>
  );
};

export default ActividadCard;
