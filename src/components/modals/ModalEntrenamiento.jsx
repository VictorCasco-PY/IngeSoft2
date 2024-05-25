import React, { useState, useEffect } from "react";
import ButtonCrear from "../bottons/ButtonCrear.jsx";
import LabelBase from "../labels/LabelBase";
import { usePlanes } from "../../hooks/usePlanes.jsx";
import toast from "react-hot-toast";

const ModalEntrenamiento = ({ children, nivel, onClose, onCreate }) => {
  const [actividades, setActividades] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]); // Nuevo estado para eentrenadores
  const [selectedActividad, setSelectedActividad] = useState("");
  const [selectedEntrenadores, setSelectedEntrenadores] = useState(""); 
  const [nombreEntrenamiento, setNombreEntrenamiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [errors, setErrors] = useState({});
  const { getActividades, getEmpleados } = usePlanes(); 

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const res = await getActividades();
        setActividades(res.items); // Establece las actividades en el estado
      } catch (error) {
        console.error("Error al obtener las actividades:", error);
      }
    };

    const fetchEntrenadores = async () => {
      try {
        const res = await getEmpleados();
        setEntrenadores(res.items);
      } catch (error) {
        console.error("Error al obtener los entrenadores:", error);
      }
    };

    fetchActividades();
    fetchEntrenadores(); 
  }, []);

  const handleAceptar = async () => {
    const newErrors = {};

    if (!nombreEntrenamiento) {
      newErrors.nombreEntrenamiento = "El nombre es obligatorio";
    } else if (nombreEntrenamiento.length > 30) {
      newErrors.nombreEntrenamiento = "El nombre debe tener máximo 30 caracteres";
    }

    if (!sexo) {
      newErrors.sexo = "El campo sexo es obligatorio";
    }

    if (!selectedActividad) {
      newErrors.actividad = "El campo actividad es obligatorio";
    }

    if (!selectedEntrenadores) {
      newErrors.empleado = "El campo entrenador es obligatorio"; 
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Todos los campos son obligatorios");
      return;
    }

    // Crea un objeto con los datos del nuevo programa
    const nuevoPrograma = {
      titulo: nombreEntrenamiento,
      nivel: nivel.toUpperCase(),
      sexo: sexo.toUpperCase(),
      actividad: selectedActividad,
      empleado: selectedEntrenadores 
    };

    // Llama a la función para crear el programa y pasa los datos del nuevo programa
    await onCreate(nuevoPrograma);
    toast.success("Plan creado con éxito");
    // Cierra el modal después de crear el programa
    onClose();
  };

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-square">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nuevo Planeamiento ({nivel})</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form className="mb-3">
              <div className="mb-3 block">
                <div className="label-container">
                  <LabelBase
                    label="Nombre de la Entrenamiento:"
                    htmlFor="nombreEntrenamiento"
                  />
                  <span className="required">*</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="nombreEntrenamiento"
                  value={nombreEntrenamiento}
                  onChange={(e) => setNombreEntrenamiento(e.target.value)}
                />
                {errors.nombreEntrenamiento && (
                  <div style={{ color: "red" }}>{errors.nombreEntrenamiento}</div>
                )}
              </div>
              <div className="mb-3 block">
                <div className="label-container">
                  <LabelBase label="Actividad:" htmlFor="actividad" />
                  <span className="required">*</span>
                </div>
                <select
                  className="form-select"
                  id="actividad"
                  value={selectedActividad}
                  onChange={(e) => setSelectedActividad(e.target.value)}
                >
                  <option value="">Seleccionar actividad</option>
                  {actividades.map((actividad) => (
                    <option key={actividad.id} value={actividad.id}>
                      {actividad.nombre}
                    </option>
                  ))}
                </select>
                {errors.actividad && (
                  <div style={{ color: "red" }}>{errors.actividad}</div>
                )}
              </div>
              <div className="mb-3 block">
                <div className="label-container">
                  <LabelBase label="Entrenador:" htmlFor="entrenador" /> 
                  <span className="required">*</span>
                </div>
                <select
                  className="form-select"
                  id="entrenador"
                  value={selectedEntrenadores}
                  onChange={(e) => setSelectedEntrenadores(e.target.value)}
                >
                  <option value="">Seleccionar entrenador</option>
                  {entrenadores.map((empleado) => (
                    <option key={empleado.id} value={empleado.id}>
                      {empleado.nombre}
                    </option>
                  ))}
                </select>
                {errors.empleado && (
                  <div style={{ color: "red" }}>{errors.empleado}</div>
                )}
              </div>
              <div className="mb-3 block">
                <div className="label-container">
                  <LabelBase label="Sexo:" htmlFor="sexo" />
                  <span className="required">*</span>
                </div>
                <select
                  className="form-select"
                  id="sexo"
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
                {errors.sexo && (
                  <div style={{ color: "red" }}>{errors.sexo}</div>
                )}
              </div>
              <div className="d-flex justify-content-center align-items-center float-end">
                <button
                  type="button"
                  id="btn-cancelar"
                  className="btn-cancelar"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <ButtonCrear
                  id="btn-guardar"
                  text="Guardar"
                  onClick={handleAceptar}
                />
              </div>
            </form>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEntrenamiento;
