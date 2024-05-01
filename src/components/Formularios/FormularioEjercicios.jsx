import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import LabelBase from "../labels/LabelBase";
import BotonCrear from "../bottons/ButtonCrear";
import ButtonBasic from "../bottons/ButtonBasic";
import { RiDeleteBinLine } from "react-icons/ri";
import { usePlanes } from "../../hooks/usePlanes";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
function FormularioEjercicios() {
  const { id } = useParams();
  const { crearEjercicios } = usePlanes();
  const [showModal, setShowModal] = useState(false);
  const [ejercicios, setEjercicios] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [maxExercisesWithoutScroll, setMaxExercisesWithoutScroll] = useState(2);
  const [ejerciciosData, setEjerciciosData] = useState({
    nombre: "",
    descripcion: "",
    tiempo: "",
    peso: "",
    repeticiones: "",
  });
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .max(30, "Nombre debe tener máximo 30 caracteres")
      .required("Nombre es obligatorio"),
    repeticiones: Yup.number()
      .max(100, "Máximo 100 repeticiones")
      .min(1, "Las repeticiones no pueden ser negativas")
      .required("Repeticiones es obligatorio"),
    peso: Yup.number()
      .max(300, "Peso máximo 300")
      .min(1, "El peso no puede ser negativo")
      .required("Peso es obligatorio"),
    tiempo: Yup.number()
      .max(60, "Tiempo máximo 1 hora")
      .min(1, "El tiempo no puede ser negativo")
      .required("Tiempo es obligatorio"),
    descripcion: Yup.string()
      .max(35, "Descripción debe tener máximo 35 caracteres")
      .required("Descripción es obligatorio"),
  });

  const handleSubmit = async () => {
    const ejercicio = {
      active: true,
      nombre: ejerciciosData.nombre,
      descripcion: ejerciciosData.descripcion,
      tiempo: parseInt(ejerciciosData.tiempo),
      peso: parseFloat(ejerciciosData.peso),
      repeticiones: parseInt(ejerciciosData.repeticiones),
    };
    setEjercicios([...ejercicios, ejercicio]);
    setHasChanges(true);
    // Limpiar los campos después de enviar el formulario
    setEjerciciosData({
      nombre: "",
      descripcion: "",
      tiempo: "",
      peso: "",
      repeticiones: "",
    });
  };

  const handleGuardar = async () => {
    try {
      for (const ejercicio of ejercicios) {
        await crearEjercicios(id, ejercicio);
        toast.success("Ejercicio creado satisfactoriamente");
      }
      setHasChanges(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (index) => {
    const updatedEjercicios = [...ejercicios];
    updatedEjercicios.splice(index, 1);
    setEjercicios(updatedEjercicios);
  };
  return (
    <div className="container">
      <Formik
        initialValues={{
          nombre: "",
          repeticiones: "",
          peso: "",
          tiempo: "",
          descripcion: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="mb-3">
          <div className="mb-2 block">
            <div className="label-container">
              <LabelBase label="Nombre de ejercicio:" htmlFor="nombre" />
              <span className="required">*</span>
            </div>
            <Field
              type="text"
              id="nombre"
              name="nombre"
              className="form-control"
              value={ejerciciosData.nombre} // Agregar esto
              onChange={(e) =>
                setEjerciciosData({ ...ejerciciosData, nombre: e.target.value })
              }
            />
            <ErrorMessage
              name="nombre"
              component="div"
              className="text-danger"
            />
          </div>

          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column">
              <div className="mb-3 block">
                <div className="label-container">
                  <LabelBase label="Repeticiones:" htmlFor="repeticiones" />
                  <span className="required">*</span>
                </div>
                <Field
                  type="number"
                  id="repeticiones"
                  name="repeticiones"
                  className="form-control custom-input"
                  value={ejerciciosData.repeticiones} // Agregar esto
                  onChange={(e) =>
                    setEjerciciosData({
                      ...ejerciciosData,
                      repeticiones: e.target.value,
                    })
                  }
                  style={{ width: "100%" }}
                />
                <ErrorMessage
                  name="repeticiones"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3 block">
                <div className="label-container">
                  <LabelBase label="Tiempo:" htmlFor="tiempo" />
                  <span className="required">*</span>
                </div>
                <Field
                  type="number"
                  id="tiempo"
                  name="tiempo"
                  className="form-control custom-input"
                  value={ejerciciosData.tiempo} // Agregar esto
                  onChange={(e) =>
                    setEjerciciosData({
                      ...ejerciciosData,
                      tiempo: e.target.value,
                    })
                  }
                  style={{ width: "243%" }}
                />
                <ErrorMessage
                  name="tiempo"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3 block">
                <div className="label-container">
                  <LabelBase label="Descripción:" htmlFor="descripcion" />
                  <span className="required">*</span>
                </div>
                <Field
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  className="form-control custom-input"
                  value={ejerciciosData.descripcion} // Agregar esto
                  onChange={(e) =>
                    setEjerciciosData({
                      ...ejerciciosData,
                      descripcion: e.target.value,
                    })
                  }
                  style={{ width: "243%" }}
                />
                <ErrorMessage
                  name="descripcion"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>
            <div className="d-flex flex-column">
              <div className="mb-3 block">
                <div className="label-container">
                  <LabelBase label="Peso:" htmlFor="peso" />
                  <span className="required">*</span>
                </div>
                <Field
                  type="number"
                  id="peso"
                  name="peso"
                  className="form-control custom-input"
                  value={ejerciciosData.peso} // Agregar esto
                  onChange={(e) =>
                    setEjerciciosData({
                      ...ejerciciosData,
                      peso: e.target.value,
                    })
                  }
                  style={{ width: "95%" }}
                />
                <ErrorMessage
                  name="peso"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>
          </div>
          <div className="mb-3 text-center float-end">
            <ButtonBasic
              id="btn-agregar"
              text="Agregar Ejercicio"
              type="button"
              onClick={handleSubmit}
            />
          </div>
          <div className="exercise-container"> 
          <div
            className="exercise-table-container"
            style={{
              maxHeight:
                ejercicios.length > maxExercisesWithoutScroll
                  ? "300px"
                  : "200px",
              overflowY:
                ejercicios.length > maxExercisesWithoutScroll
                  ? "auto"
                  : "visible",
            }}
          >
            <table className="table">
              <thead>
                <tr>
                  <th>Ejercicio</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ejercicios.map((exercise, index) => (
                  <tr key={index}>
                    <td>{exercise.nombre}</td>
                    <td>
                      <button
                        id="btn-cancelar"
                        type="button"
                        className="btn float-end"
                        onClick={() => handleDelete(index)}
                      >
                        <RiDeleteBinLine />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
          <div className="mb-4 pt-2 text-center float-end">
            <BotonCrear
              id="btn-crear"
              text="Guardar"
              type="button"
              onClick={handleGuardar}
            />
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default FormularioEjercicios;
