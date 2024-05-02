import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePlanes } from '../../../hooks/usePlanes';
import ModalBase from '../../../components/modals/ModalBase';

const DetalleEntrenamiento = () => {
  const { id } = useParams();
  const { getProgramasById } = usePlanes(); // Suponiendo que tienes una función para obtener un programa por su ID
  const [programa, setPrograma] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ejercicios, setEjercicios] = useState([]);

  useEffect(() => {
    const fetchPrograma = async () => {
      try {
        const res = await getProgramasById(id);
        setPrograma(res); // Establece los detalles del programa en el estado
      } catch (error) {
        console.error('Error al obtener los detalles del entrenamiento:', error);
      }
    };
    fetchPrograma();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAgregarEjercicio = (nuevoEjercicio) => {
    setEjercicios([...ejercicios, nuevoEjercicio]);
    handleCloseModal();
  };

  return (
    <div>
      {programa ? (
        <>
          <h2>{programa.titulo}</h2>
          <p>Nivel: {programa.nivel}</p>
          <p>Actividad: {programa.nombreActividad}</p>
          <p>Sexo: {programa.sexo}</p>
          <button onClick={handleOpenModal}>Agregar Ejercicio</button>
          {/* Aquí va el código para mostrar los ejercicios */}
        </>
      ) : (
        <p>Cargando...</p>
      )}
      {/* Modal */}
      {showModal && (
        <ModalBase onClose={handleCloseModal}>
          {/* Componente para agregar ejercicio */}
        </ModalBase>
      )}
    </div>
  );
};

export default DetalleEntrenamiento;
