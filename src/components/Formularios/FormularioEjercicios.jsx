import React, { useState, useReducer } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import LabelBase from "../labels/LabelBase";

import ButtonCrear from "../bottons/ButtonCrear";
import { usePlanes } from "../../hooks/usePlanes";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";


const initialState = {
  ejercicios: [],
};

const ejercicioReducer = (state, action) => {
  switch (action.type) {
    case "ADD_EJERCICIO":
      return { ...state, ejercicios: [...state.ejercicios, action.ejercicio] };
    default:
      return state;
  }
};

function FormularioEjercicios({onTableRefresh }) {
  const [state, dispatch] = useReducer(ejercicioReducer, initialState);
  const { id } = useParams();
  const { crearEjercicios } = usePlanes();
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({
    nombre: "",
    repeticiones: "",
    peso: "",
    tiempo: "",
    descripcion: "",
  });

  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .max(30, "Nombre debe tener máximo 30 caracteres")
      .required("Nombre es obligatorio"),
    repeticiones: Yup.number()
      .max(100, "Máximo 100 repeticiones")
      .min(1, "Las repeticiones no pueden ser negativas"),
     
    peso: Yup.number()
      .max(300, "Peso máximo 300")
      .min(1, "El peso no puede ser negativo"),
      
    tiempo: Yup.number()
      .max(60, "Tiempo máximo 1 hora")
      .min(1, "El tiempo no puede ser negativo"),
      
    descripcion: Yup.string()
      .max(35, "Descripción debe tener máximo 35 caracteres")
      .required("Descripción es obligatorio"),
  });

  const handleGuardar = async () => {
    if (!formValues.nombre || !formValues.descripcion) {
      toast.error("Nombre y descripción son campos obligatorios");
      return;
    }
    try {
      // Agregar el ejercicio al estado global
      dispatch({ type: "ADD_EJERCICIO", ejercicio: formValues });
      // Limpiar el formulario después de guardar
      setFormValues({
        nombre: "",
        repeticiones: "",
        peso: "",
        tiempo: "",
        descripcion: "",

      });
      await crearEjercicios(id, { ...formValues, programaId: id });
      toast.success("Ejercicios creados exitosamente");
      setShowModal(false);
      onTableRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    
    <div className="container">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: "#75B798",
              color: "#0A3622",
            },
          },
          error: {
            style: {
              background: "#FFDBD9",
              color: "#D92D20",
            },
          },
        }}
      />
      <Formik
        initialValues={formValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          const ejercicio = {
            active: true,
            nombre: values.nombre,
            descripcion: values.descripcion,
            tiempo: parseInt(values.tiempo),
            peso: parseFloat(values.peso),
            repeticiones: parseInt(values.repeticiones),
          };
          dispatch({ type: "ADD_EJERCICIO", ejercicio });
          resetForm();
        }}
      >
        <Form className="mb-3">
          <div className="mb-2 block">
            <div className="label-container">
              <LabelBase label="Nombre de ejercicio:" htmlFor="nombre" />
              <span className="required">*</span>
            </div>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formValues.nombre}
              className="form-control"
              onChange={handleChange}
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
                <input
                  type="number"
                  id="repeticiones"
                  name="repeticiones"
                  value={formValues.repeticiones}
                  className="form-control"
                  onChange={handleChange}
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
                <input
                  type="number"
                  id="tiempo"
                  name="tiempo"
                  value={formValues.tiempo}
                  className="form-control"
                  style={{width:"245%"}}
                  onChange={handleChange}
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
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  value={formValues.descripcion}
                  className="form-control"
                  style={{width:"245%"}}
                  onChange={handleChange}
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
                <input
                  type="number"
                  id="peso"
                  name="peso"
                  value={formValues.peso}
                  className="form-control"
                  onChange={handleChange}
                  
                />
                <ErrorMessage
                  name="peso"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>
          </div>
          <div className="mb-3 my-5 text-center float-end">
            <ButtonCrear
              id="btn-crear"
              text="Crear Ejercicio"
              onClick={handleGuardar}
            />
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default FormularioEjercicios;
