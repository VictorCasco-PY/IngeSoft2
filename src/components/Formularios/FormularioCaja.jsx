import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import LabelBase from "../labels/LabelBase";
import ButtonCrear from "../bottons/ButtonCrear";
import ButtonBasic from "../bottons/ButtonBasic";
import DateTime from "react-datetime";

import { useComprasCaja } from "../../pages/compras_caja/context/ComprasCajaState";

import "react-datepicker/dist/react-datepicker.css";
import "react-datetime/css/react-datetime.css";

const FormularioCaja = () => {
  const {
    addItem,
    items,
    generarFacturaYActualizarProductos,
    guardarFacturaProveedor,
  } = useComprasCaja();

  const [formData, setFormData] = useState({
    fecha: new Date(),
    modalidadPago: "",
    ruc: "",
    razonSocial: "",
    direccion: "",
    cantidad: "",
    producto: "",
    precioUnitario: "",
    iva: "",
    subtotal: "",
  });
  const [facturaGenerada, setFacturaGenerada] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, fecha: date });
  };
  const handleAddItem = () => {
    addItem(formData);

    setFormData({
      // Limpiar el formulario
      fecha: new Date(),
      modalidadPago: "",
      ruc: "",
      razonSocial: "",
      direccion: "",
      cantidad: "",
      producto: "",
      precioUnitario: "",
      iva: "",
      subtotal: "",
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Valores", formData);
    // Agregar el nuevo elemento a la lista items
    addItem(formData);
    // Restablecer los valores del formulario
    setFormData({
      fecha: new Date(),
      modalidadPago: "",
      ruc: "",
      razonSocial: "",
      direccion: "",
      cantidad: "",
      producto: "",
      precioUnitario: "",
      iva: "",
      subtotal: "",
    });
  };
  const handleGenerateInvoice = async () => {
    await generarFacturaYActualizarProductos(items);
    await guardarFacturaProveedor(formData);
    setFacturaGenerada(true);
    console.log("Generar factura y enviar detalles a la API...");
  };
  return (
    <form>
      <div className="row mb-3">
        <div className="col-md-4">
          <LabelBase htmlFor="fecha">Fecha</LabelBase>
          <DateTime
            value={formData.fecha}
            inputProps={{ className: "form-control" }}
            onChange={handleDateChange}
          />
        </div>
        <div className="col-md-3">
          <LabelBase htmlFor="modalidadPago">Modalidad de Pago</LabelBase>
          <select
            name="modalidadPago"
            value={formData.modalidadPago}
            onChange={handleChange}
            className="form-control"
          >
            <option value="contado">Efectivo</option>
            <option value="cuota">Tarjeta</option>
            <option value="contado">Transferencia</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <LabelBase htmlFor="ruc">RUC</LabelBase>
          <input
            type="text"
            name="ruc"
            value={formData.ruc}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <LabelBase htmlFor="razonSocial">Razón Social</LabelBase>
          <input
            type="text"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-12">
          <LabelBase htmlFor="direccion">Dirección</LabelBase>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>
      <hr />
      <div className="row mb-3">
        <div className="col-md-1">
          <LabelBase htmlFor="cantidad">Cantidad</LabelBase>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-3">
          <LabelBase htmlFor="producto">Producto</LabelBase>
          <input
            type="text"
            name="producto"
            value={formData.producto}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <LabelBase htmlFor="precioUnitario">Precio Unitario</LabelBase>
          <input
            type="number"
            name="precioUnitario"
            value={formData.precioUnitario}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-1">
          <LabelBase htmlFor="iva">IVA</LabelBase>
          <input
            type="number"
            name="iva"
            value={formData.iva}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <LabelBase htmlFor="subtotal">Subtotal</LabelBase>
          <input
            type="number"
            name="subtotal"
            value={formData.subtotal}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-3 d-flex align-items-end justify-content-end">
          <ButtonBasic text={"Agregar Items"} onClick={handleAddItem} />
        </div>
      </div>
      <div className="mb-3">
        <hr />
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Cantidad</th>
              <th scope="col">Producto</th>
              <th scope="col">P.Unitario</th>
              <th scope="col">Iva</th>
              <th scope="col">SubTotal(Gs)</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.cantidad}</td>
                <td>{item.producto}</td>
                <td>{item.precioUnitario}</td>
                <td>{item.iva}</td>
                <td>{item.subtotal}</td>
                <td>
                  {/* Aquí puedes agregar botones para editar o eliminar el elemento */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-end">
        <ButtonCrear
          id="btn-crear"
          text="Generar Factura"
          color="secondary"
          onClick={handleGenerateInvoice}
          disabled={facturaGenerada}
        />
      </div>
    </form>
  );
};

export default FormularioCaja;
