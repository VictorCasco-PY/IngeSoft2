import React, { useState } from 'react';

const NuevoEjercicioForm = () => {
  const [nombreEjercicio, setNombreEjercicio] = useState('');
  const [repeticiones, setRepeticiones] = useState(0);
  const [peso, setPeso] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoEjercicio = {
      nombreEjercicio,
      repeticiones,
      peso,
      tiempo,
      descripcion,
    };

    // Enviar el nuevo ejercicio al servidor o a la base de datos
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nuevo Ejercicio</h2>

      <div className="campo-form">
        <label htmlFor="nombreEjercicio">Nombre de ejercicio *</label>
        <input
          type="text"
          id="nombreEjercicio"
          value={nombreEjercicio}
          onChange={(e) => setNombreEjercicio(e.target.value)}
          required
        />
      </div>

      <div className="campo-form">
        <label htmlFor="repeticiones">Repeticiones *</label>
        <input
          type="number"
          id="repeticiones"
          value={repeticiones}
          onChange={(e) => setRepeticiones(e.target.value)}
          required
        />
      </div>

      <div className="campo-form">
        <label htmlFor="peso">Peso (kg) *</label>
        <input
          type="number"
          id="peso"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          required
        />
      </div>

      <div className="campo-form">
        <label htmlFor="tiempo">Tiempo (min) *</label>
        <input
          type="number"
          id="tiempo"
          value={tiempo}
          onChange={(e) => setTiempo(e.target.value)}
          required
        />
      </div>

      <div className="campo-form">
        <label htmlFor="descripcion">Descripción *</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>

      <div className="botones-form">
        <button type="submit">Agregar ejercicio</button>
        <button type="button">Atrás</button>
      </div>
    </form>
  );
};

export default NuevoEjercicioForm;
