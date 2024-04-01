import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import FlechaAtras from "../../../../components/flechaAtras/FlechaAtras";
import { Btn } from "../../../../components/bottons/Button";
import classes from "./FacturaForm.module.css";
import api from "../../../../utils/api";
import { Toaster, toast } from "react-hot-toast";
import { RiDeleteBinLine } from "react-icons/ri";

const FacturaForm = () => {
  const [suscripcion, setSuscripcion] = useState([
    {
      suscripcionId: "",
      precioUnitario: "",
      cantidad: 1,
      subtotal: "",
      iva: "",
      ivaTotal: "",
    },
  ]);

  const initialValues = {
    factura: {
      clienteId: "",
      timbrado: 1547884,
      fecha: "",
      nombreCliente: "",
      rucCliente: "",
      direccion: "",
    },
    detalles: [],
  };

  const validationSchema = Yup.object().shape({
    rucCliente: Yup.string()
      .min(6, "Numero de ruc invalido")
      .required("*Numero de ruc obligatorio"),
    direccion: Yup.string()
      .min(3, "Direccion invalida")
      .required("*Direccion obligatoria"),
  });

  const getClienteById = async (ruc, setFieldValue) => {
    try {
      const data = await api.get(`/clientes/searchByRuc/${ruc}/page/1`);
      const cliente = data.data;
      console.log(cliente);
      if (cliente) {
        setFieldValue("factura.nombreCliente", cliente.items[0].nombre);
        setFieldValue("factura.clienteId", cliente.items[0].id);
        setFieldValue("factura.direccion", cliente.items[0].direccion);
      }
    } catch (error) {
      toast.error("Cliente no encontrado");
    }
  };

  const getFacturasPendientes = async (clienteId) => {
    try {
      const data = await api.get(
        `/suscripciones/cliente/${clienteId}/pendientes/page/1`
      );
      const response = data.data;
      console.log(response);
    } catch (error) {}
  };

  getFacturasPendientes(1);

  const handleSubmit = (values) => {
    console.log("Form data: ", values);
  };
  return (
    <div className={classes.form_container}>
      <div>
        <Toaster position="top-right" />
      </div>
      <div className={classes.title_container}>
        <FlechaAtras />
        <h1 className={classes.title}>Registrar venta</h1>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => {
          // console.log("Formik props", formik);
          return (
            <Form c>
              <div className="row mb-4">
                <div className="col-3">
                  <label htmlFor="fecha">Fecha</label>
                  <Field
                    type="date"
                    id="fecha"
                    name="factura.fecha"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-4">
                  <label htmlFor="rucCliente">RUC</label>
                  <Field
                    type="text"
                    id="rucCliente"
                    name="factura.rucCliente"
                    className="form-control"
                    onKeyDown={async (e) => {
                      if (e.key === "Tab") {
                        await getClienteById(
                          e.target.value,
                          formik.setFieldValue
                        );
                      }
                    }}
                  />
                </div>
                <div className="col">
                  <label htmlFor="nombreCliente">Razon social</label>
                  <Field
                    id="razon-social"
                    name="factura.nombreCliente"
                    className="form-control"
                    disabled
                  />
                </div>
              </div>
              <div className="col mb-4">
                <label htmlFor="direccion">Direccion</label>
                <Field
                  id="direccion"
                  name="factura.direccion"
                  className="form-control"
                />
              </div>
              <hr />
              {/* Detalles */}
              <div className="row mb-4 d-flex align-items-center justify-content-between">
                <div className="col-1">
                  <label htmlFor="cantidad">Cantidad</label>
                  <Field
                    type="number"
                    id="cantidad"
                    name="detalles.cantidad"
                    className="form-control"
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="descripcion">Descripcion</label>
                  <Field
                    id="descripcion"
                    name="detalles.descripcion"
                    className="form-control"
                  />
                </div>
                <div className="col-2">
                  <label htmlFor="descripcion">P. Unitario</label>
                  <Field
                    type="number"
                    id="precio-unitario"
                    name="detalles.precio_unitario"
                    className="form-control"
                  />
                </div>
                <div className="col-1">
                  <label htmlFor="iva">IVA(%)</label>
                  <Field
                    type="number"
                    id="iva"
                    name="detalles.iva"
                    className="form-control"
                  />
                </div>
                <div className="col-2">
                  <label htmlFor="subtotal">Subtotal</label>
                  <Field
                    type="number"
                    id="subtotal"
                    name="detalles.subtotal"
                    className="form-control"
                  />
                </div>
                <div className="col-auto mt-1">
                  <Btn type="secondary" outline className="mt-4">
                    Agregar Item
                  </Btn>
                </div>
              </div>
              <hr />
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Cantidad</th>
                      <th>Descripcion</th>
                      <th>P. Unitario</th>
                      <th>IVA</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Cuota mensual</td>
                      <td>120.000</td>
                      <td>10</td>
                      <td>120.000</td>
                      <td>
                        <button className="btn">
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Cuota mensual</td>
                      <td>120.000</td>
                      <td>10</td>
                      <td>120.000</td>
                      <td>
                        <button className="btn">
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={classes.button_container}>
                <Btn submit type="primary">
                  Generar factura
                </Btn>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FacturaForm;
