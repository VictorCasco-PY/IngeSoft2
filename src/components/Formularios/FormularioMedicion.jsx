import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import LabelBase from "../labels/LabelBase";
import ButtonBasic from "../bottons/ButtonBasic";
import useClienteData from "../../hooks/useClientesData";

const FormularioMedicion = ({ formValues, onInputChange, onCrearMedicion }) => {
  return (
    <Formik
    initialValues={formValues}
    validationSchema={Yup.object({
      peso: Yup.number()
        .required("El peso es requerido")
        .min(0.1, "El peso no puede ser negativo ni igual a 0")
        .max(300, "El peso máximo es 300 kg"),
      altura: Yup.number()
        .required("La altura es requerida")
        .min(0.1, "La altura no puede ser negativa ni igual a 0")
        .max(250, "La altura máxima es 250 cm"),
      imc: Yup.number()
        .required("El IMC es requerido")
        .min(0.1, "El IMC no puede ser negativo ni igual a 0")
        .max(50, "El IMC máximo es 50"),
      cirBrazo: Yup.number()
        .required("La circunferencia del brazo es requerida")
        .min(0.1, "La circunferencia del brazo no puede ser negativa ni igual a 0")
        .max(100, "La circunferencia del brazo máxima es 100 cm"),
      cirPiernas: Yup.number()
        .required("La circunferencia de las piernas es requerida")
        .min(0.1, "La circunferencia de las piernas no puede ser negativa ni igual a 0")
        .max(100, "La circunferencia de las piernas máxima es 100 cm"),
      cirCintura: Yup.number()
        .required("La circunferencia de la cintura es requerida")
        .min(0.1, "La circunferencia de la cintura no puede ser negativa ni igual a 0")
        .max(100, "La circunferencia de la cintura máxima es 100 cm"),
      cirPecho: Yup.number()
        .required("La circunferencia del pecho es requerida")
        .min(0.1, "La circunferencia del pecho no puede ser negativa ni igual a 0")
        .max(100, "La circunferencia del pecho máxima es 100 cm"),
    })}
      onSubmit={(values) => {
        onCrearMedicion(values);
      }}
    >
      {({ setFieldValue, isValid}) => (
        <form className="mb-3">
          <div className="mb-2 block">
            <LabelBase label="Peso: (kg)" htmlFor="peso" />
            <Field
              type="number"
              id="peso"
              name="peso"
              className="form-control"
              value={formValues.peso}
              onChange={(e) => {
                setFieldValue("peso", e.target.value);
                onInputChange(e);
              }}
            />
            <ErrorMessage
              name="peso"
              component="div"
              className="error"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-2 block">
            <LabelBase label="Altura: (Cm)" htmlFor="altura" />
            <Field
              type="number"
              id="altura"
              name="altura"
              className="form-control"
              value={formValues.altura}
              onChange={(e) => {
                setFieldValue("altura", e.target.value);
                onInputChange(e);
              }}
            />
            <ErrorMessage
              name="altura"
              component="div"
              className="error"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-2 block">
            <LabelBase label="Imc:" htmlFor="imc" />
            <Field
              type="number"
              id="imc"
              name="imc"
              className="form-control"
              value={formValues.imc}
              onChange={(e) => {
                setFieldValue("imc", e.target.value);
                onInputChange(e);
              }}
            />
            <ErrorMessage
              name="imc"
              component="div"
              className="error"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-2 block">
            <LabelBase
              label="Circunferencia del Brazo: (Cm)"
              htmlFor="CirBrazo"
            />
            <Field
              type="number"
              id="cirBrazo"
              name="cirBrazo"
              className="form-control"
              value={formValues.cirBrazo}
              onChange={(e) => {
                setFieldValue("cirBrazo", e.target.value);
                onInputChange(e);
              }}
            />
            <ErrorMessage
              name="cirBrazo"
              component="div"
              className="error"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-2 block">
            <LabelBase
              label="Circunferencia de las Piernas: (Cm)"
              htmlFor="CirPiernas"
            />
            <Field
              type="number"
              id="cirPiernas"
              name="cirPiernas"
              className="form-control"
              value={formValues.cirPiernas}
              onChange={(e) => {
                setFieldValue("cirPiernas", e.target.value);
                onInputChange(e);
              }}
            />
            <ErrorMessage
              name="cirPiernas"
              component="div"
              className="error"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-2 block">
            <LabelBase
              label="Circunferencia de la Cintura: (Cm)"
              htmlFor="CirCintura"
            />
            <Field
              type="number"
              id="cirCintura"
              name="cirCintura"
              className="form-control"
              value={formValues.cirCintura}
              onChange={(e) => {
                setFieldValue("cirCintura", e.target.value);
                onInputChange(e);
              }}
            />
            <ErrorMessage
              name="cirCintura"
              component="div"
              className="error"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-2 block">
            <LabelBase
              label="Circunferencia del Pecho: (Cm)"
              htmlFor="CirPecho"
            />
            <Field
              type="number"
              id="cirPecho"
              name="cirPecho"
              className="form-control"
              value={formValues.cirPecho}
              onChange={(e) => {
                setFieldValue("cirPecho", e.target.value);
                onInputChange(e);
              }}
            />
            <ErrorMessage
              name="cirPecho"
              component="div"
              className="error"
              style={{ color: "red" }}
            />
          </div>

          <div className="d-flex justify-content-center align-items-center float-end">
            <ButtonBasic text="Crear Medición" onClick={onCrearMedicion} disabled={!isValid}/>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormularioMedicion;
