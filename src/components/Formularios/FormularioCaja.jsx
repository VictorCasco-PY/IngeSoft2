import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import LabelBase from "../labels/LabelBase";
import ButtonCrear from "../bottons/ButtonCrear";
import ButtonBasic from "../bottons/ButtonBasic";
import DateTime from "react-datetime";
import { FacturaModal } from "../../pages/caja/FacturaModal";

import "react-datepicker/dist/react-datepicker.css";
import "react-datetime/css/react-datetime.css";

import api from "../../utils/api";

const FormularioCaja = () => {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [proveedorInfo, setProveedorInfo] = useState({
    ruc: "",
    nombre: "",
    proveedorIdId: "",
    direccion: "",
  });
  const [formData, setFormData] = useState({
    proveedorId: "",
    productoId: "",
    fecha: "",
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
  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const response = await api.get("/proveedores/page/1");
        setProveedores(response.data.items);
      } catch (error) {
        console.error("Error al obtener los proveedores:", error);
      }
    };

    const obtenerProductos = async () => {
      try {
        const response = await api.get("/productos/page/1");
        setProductos(response.data.items);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    obtenerProveedores();
    obtenerProductos();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Si el campo cambiado es el RUC, buscar el proveedor correspondiente
    if (name === "ruc") {
      try {
        const response = await api.get(
          `/facturas-proveedores/ruc/${value}/page/1`
        );
        const proveedor = response.data.items[0];
        if (proveedor) {
          // Completar los datos del proveedor en el formulario
          setFormData({
            ...formData,
            razonSocial: proveedor.razonSocial,
            direccion: proveedor.direccion,
            // Otros campos del proveedor que desees completar
          });
        } else {
          // Limpiar los datos del proveedor si no se encontró ninguno
          setFormData({
            ...formData,
            razonSocial: "",
            direccion: "",
            // Otros campos del proveedor que desees limpiar
          });
        }
      } catch (error) {
        console.error("Error al buscar el proveedor por RUC:", error);
      }
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, fecha: date });
  };

  const handleAddItem = () => {
    // Agregar los datos del formulario al array de items
    setItems([...items, formData]);
    // Limpiar el formulario después de agregar el item
    setFormData({
      fecha: "",
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
  const handleGenerateFactura = () => {
    // Aquí debes abrir el modal y pasar los datos necesarios
    setModalOpen(true);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Tab") {
      const codigo = e.target.value;
      try {
        const response = await api.get(`/productos/${codigo}`);
        const productoData = response.data;
        if (productoData) {
          // Actualizar el estado del producto y la cantidad máxima disponible
          setFormData({
            ...formData,
            producto: productoData.nombre,
            precioUnitario: productoData.precio,
            iva: productoData.iva,
            // Otros campos del producto que desees actualizar
          });
        } else {
          // Limpiar los campos del producto si no se encontró ninguno
          setFormData({
            ...formData,
            producto: "",
            precioUnitario: "",
            iva: "",
            // Otros campos del producto que desees limpiar
          });
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    }
  };
 
  const handleSubmit = async (values) => {
    try {
      const response = await api.post('/facturas-proveedores', values);
      console.log('Factura generada:', response.data);
      
    } catch (error) {
      console.error('Error al generar la factura:', error);
     
    }
  };

  const getProductoByCodigo = async (codigo) => {
    try {
      const response = await api.get(`/productos/codigo/${codigo}`);
      const productoData = response.data;
      if (productoData) {
        setFormData({
          ...formData,
          producto: productoData.nombre,
          precioUnitario: productoData.precio,
          iva: productoData.iva,
        });
      } else {
        setFormData({
          ...formData,
          producto: "",
          precioUnitario: "",
          iva: "",
        });
      }
    } catch (error) {
      console.error("Error al obtener el producto:", error);
    }
  };
  const getProveedorByRuc = async (ruc) => {
    try {
      const response = await api.get(`/proveedores/searchByRuc/${ruc}/page/1`);
      const proveedorData = response.data;
      if (proveedorData) {
        setProveedorInfo({
          ruc: ruc,
          nombre: proveedorData.items[0].nombre,
          proveedorId: proveedorData.items[0].id,
          direccion: proveedorData.items[0].direccion,
        });
        setFormData({
          ...formData,
          ruc: ruc,
          razonSocial: proveedorData.items[0].nombre,
          direccion: proveedorData.items[0].direccion,
        });
      } else {
        setProveedorInfo({
          ruc: "",
          nombre: "",
          proveedorId: "",
          direccion: "",
        });
        setFormData({
          ...formData,
          ruc: "",
          razonSocial: "",
          direccion: "",
        });
      }
    } catch (error) {
      console.error("Error al obtener el cliente:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="row mb-3">
        <div className="col-md-4">
          <LabelBase htmlFor="fecha">Fecha</LabelBase>
          <DateTime
            value={formData.fecha}
            inputProps={{ className: "form-control" }}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <LabelBase htmlFor="ruc">RUC</LabelBase>
          <input
            type="text"
            id="rucProveedor"
            name="factura.rucProveedor"
            className="form-control"
            onKeyDown={async (e) => {
              if (e.key === "Tab") {
                await getProveedorByRuc(e.target.value);
              }
            }}
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
            id="codigo"
            name="detalles.codigo"
            className="form-control"
            style={{ width: "120px" }}
            min={0}
            onKeyDown={async (e) => {
              if (e.key === "Tab") {
                await getProductoByCodigo(e.target.value);
              }
            }}
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
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-end">
        <ButtonCrear id="btn-crear" text="Generar Factura" color="secondary" />
      </div>

      {/* Modal de la factura */}
      {modalOpen && (
        <FacturaModal
          open={modalOpen}
          closeModal={() => setModalOpen(false)}
          data={{
            factura: {
              /* Aquí pasas los datos de la factura */
            },
            detalles: items,
          }}
          guardar={() => {
            /* Función para guardar la factura */
          }}
        />
      )}
    </form>
  );
};

export default FormularioCaja;
