import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import BotonCrear from "../bottons/ButtonCrear";
import { usePlanes } from "../../hooks/usePlanes";

const EditarProgramaForm = ({ programa, onClose, onUpdate }) => {
  const [actividades, setActividades] = useState([]);
  const { getActividades, actualizarPrograma } = usePlanes();

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const res = await getActividades();
        setActividades(res.items); // Establece las actividades en el estado
      } catch (error) {
        console.error("Error al obtener las actividades:", error);
      }
    };
    fetchActividades();
  }, []);

  const validationSchema = Yup.object().shape({
    titulo: Yup.string()
      .max(30, "El título debe tener máximo 30 caracteres")
      .required("El título es obligatorio"),
    nombreActividad: Yup.string()
      .max(30, "El nombre de la actividad debe tener máximo 30 caracteres")
      .required("El nombre de la actividad es obligatorio"),
    sexo: Yup.string().required("El sexo es obligatorio"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updatedProgram = await actualizarPrograma(programa.id, values);
      console.log(updatedProgram)
      onUpdate(updatedProgram); // Se pasa el programa actualizado
      onClose();
      setSubmitting(false);
    } catch (error) {
      console.error("Error al actualizar el programa:", error);
    }
};


  return (
    <Formik
      initialValues={{
        titulo: programa.titulo,
        nombreActividad: programa.nombreActividad,
        sexo: programa.sexo,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-group">
            <label htmlFor="titulo">Título:</label>
            <Field type="text" name="titulo" className="form-control" />
            <ErrorMessage
              name="titulo"
              component="div"
              className="text-danger"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombreActividad">Nombre de la actividad:</label>
            <Field as="select" name="nombreActividad" className="form-control">
              {actividades.map((actividad) => (
                <option key={actividad.id} value={actividad.nombre}>
                  {actividad.nombre}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="nombreActividad"
              component="div"
              className="text-danger"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nivel">Nivel:</label>
            <p>{programa.nivel}</p>
          </div>

          <div className="form-group">
            <label htmlFor="sexo">Sexo:</label>
            <Field as="select" name="sexo" className="form-control">
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </Field>
            <ErrorMessage name="sexo" component="div" className="text-danger" />
          </div>

          <div className="mb-4 pt-2 text-center float-end">
            {/* Agrega el evento onClick para llamar a la función handleSubmit */}
            <BotonCrear
              id="btn-crear"
              text="Actualizar"
              type="button"
              onClick={() => handleSubmit({}, { setSubmitting: () => {} })}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditarProgramaForm;
