import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import LabelBase from "../labels/LabelBase";
import ButtonCrear from "../bottons/ButtonCrear";
import ButtonBasic from "../bottons/ButtonBasic";

import DatePicker from "react-datepicker";

import { FacturaModal } from "../../pages/caja/FacturaModal";
import { Toaster, toast } from "react-hot-toast";
import { RiDeleteBinLine } from "react-icons/ri";
import "react-datepicker/dist/react-datepicker.css";
import "react-datetime/css/react-datetime.css";

import api from "../../utils/api";

const FormularioCaja = () => {
  const [fecha, setFecha] = useState(new Date());
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().substr(0, 10);
  const [detallesParaMostrar, setDetallesParaMostrar] = useState([]);
  const [detallesParaEnviar, setDetallesParaEnviar] = useState([]);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [codigo, setCodigo] = useState("");
  const [datosFactura, setDatosFactura] = useState({
    proveedorId: "",
    timbrado: "",
    fecha: formattedDate,
    nombreProveedor: "",
    rucProveedor: "",
    direccion: "",
    subTotal: 0,
    iva5: 0,
    iva10: 0,
    total: 0,
    saldo: 0,
  });
  const [proveedorInfo, setProveedorInfo] = useState({
    nombre: "",
    proveedorId: "",
    direccion: "",
    ruc: "",
  });
  const [producto, setProducto] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    cantidad: "",
    precio: "",
    iva: "",
  });

  const handleFechaChange = (date) => {
    setFecha(date);
  };
  const handleGuardarFactura = async (subTotal, iva5, iva10, total) => {
    try {
      // Preparar los datos de la factura
      const datosFactura = {
        factura: {
          proveedorId: proveedorInfo.proveedorId,
          timbrado: "1547884", // Ejemplo de número de timbrado
          nombreProveedor: proveedorInfo.nombre,
          rucProveedor: proveedorInfo.ruc,
          fecha: formattedDate,
          subTotal: subTotal,
          iva5: iva5,
          iva10: iva10,
          total: total,
          saldo: total,
          pagado: true,
        },
        detalles: detallesParaEnviar,
      };
      // Enviar los datos al backend para guardar la factura
      const response = await api.post("/facturas-proveedores", datosFactura);
      toast.success("Factura generada correctamente");
      if (response.status === 201) {
        // Reiniciar los estados del formulario después de crear la factura
        setProveedorInfo({
          ruc: "",
          nombre: "",
          proveedorId: "",
          direccion: "",
        });
        setDetallesParaMostrar([]);
        setDetallesParaEnviar([]);
        setDatosFactura({
          proveedorId: "",
          timbrado: "1547884",
          fecha: formattedDate,
          nombreProveedor: "",
          rucCliente: "",
          direccion: "",
          subTotal: 0,
          iva5: 0,
          iva10: 0,
          total: 0,
          saldo: 0,
        });
        setCodigo("");
      } else {
        // Manejar posibles errores
        toast.error("Error al guardar la factura");
      }
    } catch (error) {
      // Manejar errores de la llamada a la API
      console.error("Error al guardar la factura:", error);
      toast.error("Error al guardar la factura");
    }
  };

  const handleCrearFactura = async () => {
    console.log("Datos de la factura a enviar:", datosFactura);
    try {
      // Llamada a la API para crear la factura de proveedores con los datos de la factura
      const response = await api.post("/facturas-proveedores", datosFactura);

      if (response.status === 201) {
        // Si la factura se crea con éxito, cierra el modal y muestra un mensaje de éxito
        setModalVisible(false);
      } else {
        // Si hay algún error en la respuesta de la API, muestra un mensaje de error
        toast.error("Error al crear la factura");
      }
    } catch (error) {
      // Si hay algún error en la llamada a la API, muestra un mensaje de error
      console.error("Error al crear la factura:", error);
      toast.error("Error al crear la factura");
    }
  };

  const getProveedorById = async (ruc) => {
    try {
      const response = await api.get(`/proveedores/getByRuc/${ruc}`);
      const proveedorData = response.data;
      if (proveedorData) {
        setProveedorInfo({
          ruc: ruc,
          nombre: proveedorData.nombre,
          proveedorId: proveedorData.id,
          direccion: proveedorData.direccion,
        });
      } else {
        toast.error("Proveedor no encontrado");
      }
    } catch (error) {
      console.error("Error al obtener el proveedor:", error);
      toast.error("No existe un proveedor con ese RUC");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calcular subtotal, iva5, iva10 y total
      let subTotal = 0;
      let iva5 = 0;
      let iva10 = 0;
      detallesParaEnviar.forEach((detalle) => {
        subTotal += detalle.subtotal;
        if (detalle.iva === 5) {
          iva5 += detalle.ivaTotal;
        } else if (detalle.iva === 10) {
          iva10 += detalle.ivaTotal;
        }
      });
      const total = subTotal;
      // Enviar la factura al backend

      setDatosFactura({
        proveedorId: proveedorInfo.proveedorId,
        timbrado: "1547884",
        fecha: formattedDate,
        nombreProveedor: proveedorInfo.nombre,
        rucCliente: proveedorInfo.ruc,
        direccion: proveedorInfo.direccion,
        subTotal: subTotal,
        iva5: iva5,
        iva10: iva10,
        total: total,
        saldo: total,
      });

      await handleGuardarFactura(subTotal, iva5, iva10, total);
    } catch (error) {
      toast.error("No se pudo cargar la factura");
    }
  };
  const handleAgregarItem = () => {
    const nuevoDetalleMostrar = {
      cantidad: producto.cantidad,
      producto: producto.nombre,
      precioUnitario: producto.precio,
      iva: producto.iva,
      subtotal: producto.precio * producto.cantidad,
    };
    console.log(nuevoDetalleMostrar);

    const nuevoDetalleEnviar = {
      productoId: producto.id,
      precioUnitario: producto.precio,
      cantidad: producto.cantidad,
      subtotal: producto.precio * producto.cantidad,
      iva: producto.iva,
      ivaTotal: producto.precio * producto.cantidad * producto.iva,
    };
    console.log(nuevoDetalleEnviar);
    // Agregar nuevo detalle al estado detallesParaMostrar
    setDetallesParaMostrar([...detallesParaMostrar, nuevoDetalleMostrar]);
    setDetallesParaEnviar([...detallesParaEnviar, nuevoDetalleEnviar]);
    // Limpiar los inputs de los items
    setProducto({
      id: "",
      nombre: "",
      descripcion: "",
      cantidad: "",
      precio: "",
      iva: "",
    });
    setCodigo("");
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Tab") {
      const codigoProducto = e.target.value;
      try {
        const response = await api.get(`/productos/codigo/${codigoProducto}`);
        const productoData = response.data;
        if (productoData) {
          setProducto({
            id: productoData.id,
            nombre: productoData.nombre,
            descripcion: productoData.descripcion,
            cantidad: Math.min(producto.cantidad, productoData.cantidad),
            precio: productoData.precio,
            iva: productoData.iva,
          });
          setCantidadMaxima(productoData.cantidad);
        } else {
          toast.error("Producto no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
        toast.error("No existe un prodducto con ese codigo");
      }
    }
  };
  const tipo_iva = [
    { label: "0%", value: 0 },
    { label: "5%", value: 0.05 },
    { label: "10%", value: 0.1 },
  ];

  return (
    <form>
      <div>
        <Toaster position="top-right" />
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
          <LabelBase htmlFor="fecha">Fecha</LabelBase>
          <DatePicker
            selected={fecha}
            onChange={handleFechaChange}
            dateFormat="dd/MM/yyyy"
            className="form-control"
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
                await getProveedorById(e.target.value);
              }
            }}
          />
        </div>
        <div className="col-md-6">
          <LabelBase htmlFor="razonSocial">Razón Social</LabelBase>
          <input
            id="razon-social"
            type="text"
            name="razonSocial"
            value={proveedorInfo.nombre}
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
            value={proveedorInfo.direccion}
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
            id="cantidad"
            name="cantidad"
            className="form-control"
            value={producto.cantidad}
            min={1}
            max={cantidadMaxima}
            onChange={(e) => {
              const nuevaCantidad = parseInt(e.target.value);
              {
                setProducto((prevProducto) => ({
                  ...prevProducto,
                  cantidad: nuevaCantidad,
                }));
              }
            }}
          />
        </div>
        <div className="col-md-3">
          <LabelBase htmlFor="producto">Producto</LabelBase>
          <input
            type="number"
            id="codigo"
            name="detalles.codigo"
            className="form-control"
            min={0}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="col-md-2">
          <LabelBase htmlFor="precioUnitario">Precio Unitario</LabelBase>
          <input
            type="number"
            name="precioUnitario"
            value={producto.precio}
            className="form-control"
          />
        </div>
        <div className="col-md">
          <div className="label-container">
            <LabelBase htmlFor="iva"> Iva</LabelBase>
          </div>
          <select
            id="iva"
            name="iva"
            className="form-control "
            value={producto.iva}
          >
            {tipo_iva.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <LabelBase htmlFor="subtotal">Subtotal</LabelBase>
          <input
            type="number"
            name="subtotal"
            value={producto.precio * producto.cantidad}
            className="form-control"
          />
        </div>
        <div className="col-md-3 d-flex align-items-end justify-content-end">
          <ButtonBasic text={"Agregar Items"} onClick={handleAgregarItem} />
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
            {detallesParaMostrar.map((item, index) => (
              <tr key={index}>
                <td>{item.cantidad}</td>
                <td>{item.producto}</td>
                <td>{item.precioUnitario.toLocaleString("es-ES")}</td>
                <td>{item.iva}</td>
                <td>{item.subtotal.toLocaleString("es-ES")}</td>
                <td>
                  <button
                    className="btn"
                    onClick={() => handleDeleteDetalle(index)}
                  >
                    <RiDeleteBinLine />
                  </button>
                </td>
                <td></td>
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
          onClick={handleSubmit}
        />
      </div>
    </form>
  );
};

export default FormularioCaja;
