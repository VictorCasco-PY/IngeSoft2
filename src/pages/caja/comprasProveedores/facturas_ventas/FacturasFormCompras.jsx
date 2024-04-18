import React, { useEffect, useState } from "react";
import { Btn } from "../../../../components/bottons/Button";
import classes from "../../ventas/factura/FacturaForm.module.css";
import api from "../../../../utils/api";
import { Toaster, toast } from "react-hot-toast";
import { RiDeleteBinLine } from "react-icons/ri";
import DetalleModalCompra from "./DetalleModalCompra";

const FacturasFormCompras = () => {
  // State
  const [storedValue, setStoredValue] = useState("");
  const [formularioEnviado, setFormularioEnviado] = useState(false);

  useEffect(() => {
    // Obteniendo el valor almacenado en localStorage cuando el componente se monta
    const storedItem = localStorage.getItem("sesionCajaId");

    // Actualizando el estado con el valor almacenado, si existe
    if (storedItem) {
      setStoredValue(storedItem);
      console.log(storedValue);
    }
  }, []);

  // Constants
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().substr(0, 10);
  const [detallesParaMostrar, setDetallesParaMostrar] = useState([]);
  const [detallesParaEnviar, setDetallesParaEnviar] = useState([]);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [datosFactura, setDatosFactura] = useState({
    proveedorId: "",
    timbrado: 0,
    fecha: formattedDate,
    nombreProveedor: "",
    rucProveedor: "",
    direccion: "",
    sesionId: "",
    subTotal: 0,
    iva5: 0,
    iva10: 0,
    total: 0,
    saldo: 0,
  });

  const [clienteInfo, setClienteInfo] = useState({
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

  // Functions
  const handleGuardarFactura = () => {
    setModalVisible(true);
  };

  const getClienteById = async (ruc) => {
    try {
      const data = await api.get(`/proveedores/getByRuc/${ruc}`);
      const cliente = data.data;
      if (cliente) {
        setClienteInfo({
          ruc: ruc,
          nombre: cliente.nombre,
          proveedorId: cliente.id,
          direccion: cliente.direccion,
        });
      }
    } catch (error) {
      toast.error("Proveedor no encontrado");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormularioEnviado(true);

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
        proveedorId: clienteInfo.proveedorId,
        timbrado: 1547884,
        fecha: formattedDate,
        nombreProveedor: clienteInfo.nombre,
        rucProveedor: clienteInfo.ruc,
        direccion: clienteInfo.direccion,
        sesionId: Number(storedValue),
        subTotal: subTotal,
        iva5: iva5,
        iva10: iva10,
        total: total,
        saldo: total,
      });

      handleGuardarFactura();
    } catch (error) {
      toast.error("No se pudo cargar la factura");
    }
  };

  // Función para eliminar un detalle
  const handleDeleteDetalle = (index) => {
    const updatedDetallesMostrar = [...detallesParaMostrar];
    const updatedDetallesEnviar = [...detallesParaEnviar];

    updatedDetallesMostrar.splice(index, 1);
    updatedDetallesEnviar.splice(index, 1);

    setDetallesParaMostrar(updatedDetallesMostrar);
    setDetallesParaEnviar(updatedDetallesEnviar);
  };

  const handleAgregarItem = () => {
    // Verificar si los campos ruc y producto son válidos
    if (!clienteInfo.ruc || !producto.id || producto.id === 0) {
      toast.error("El RUC y el producto son obligatorios");
      return; // Detener la ejecución si los campos no son válidos
    }

    // Verificar si la cantidad es mayor que 0
    if (producto.cantidad === 0) {
      toast.error("No se puede agregar 0 unidades");
      return; // Detener la ejecución si la cantidad es 0
    }
    const nuevoDetalleMostrar = {
      cantidad: producto.cantidad,
      descripcion: producto.descripcion,
      precioUnitario: producto.precio,
      iva: producto.iva,
      subtotal: producto.precio * producto.cantidad,
    };

    const nuevoDetalleEnviar = {
      productoId: producto.id,
      precioUnitario: producto.precio,
      cantidad: producto.cantidad,
      subtotal: producto.precio * producto.cantidad,
      iva: producto.iva,
      ivaTotal: producto.precio * producto.cantidad * producto.iva,
    };

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
    document.getElementById("codigo").value = "";
  };

  const handleKeyDown = async (e) => {
    let codigo;
    if (e.key === "Tab") {
      codigo = e.target.value;
      try {
        const response = await api.get(`/productos/codigo/${codigo}`);
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
        toast.error("Error al obtener el producto");
      }
    }
  };

  const resetFormulario = () => {
    setClienteInfo({
      nombre: "",
      proveedorId: "",
      direccion: "",
      ruc: "",
    });
    setDatosFactura({
      proveedorId: "",
      timbrado: 0,
      fecha: formattedDate,
      nombreProveedor: "",
      rucProveedor: "",
      direccion: "",
      sesionId: "",
      subTotal: 0,
      iva5: 0,
      iva10: 0,
      total: 0,
      saldo: 0,
    });
    setDetallesParaMostrar([]);
    setDetallesParaEnviar([]);
    setFormularioEnviado(false);

    // Limpiar los campos de RUC y código
    document.getElementById("rucProveedor").value = "";
    document.getElementById("codigo").value = "";
  };

  return (
    <div className={classes.form_container}>
      <div>
        <Toaster position="top-right" />
      </div>
      <div className={classes.title_container}></div>

      <form>
        <div className="row mb-4">
          <div className="col-3">
            <label htmlFor="fecha">Fecha</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              className="form-control"
              value={formattedDate}
              readOnly
              style={{ backgroundColor: "white" }}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-4">
            <label htmlFor="rucProveedor">RUC</label>
            <input
              type="text"
              id="rucProveedor"
              name="rucProveedor"
              className="form-control"
              onKeyDown={async (e) => {
                if (e.key === "Tab") {
                  await getClienteById(e.target.value);
                }
              }}
            />
            {formularioEnviado && !clienteInfo.ruc && (
              <p style={{ color: "red" }}>Campo obligatorio</p>
            )}
          </div>
          <div className="col">
            <label htmlFor="nombreProveedor">Razon social</label>
            <input
              id="razon-social"
              name="nombreProveedor"
              className="form-control"
              value={clienteInfo.nombre}
              readOnly
              style={{ backgroundColor: "white" }}
            />
          </div>
        </div>
        <div className="col mb-4">
          <label htmlFor="direccion">Direccion</label>
          <input
            id="direccion"
            name="direccion"
            className="form-control"
            value={clienteInfo.direccion}
            readOnly
            style={{ backgroundColor: "white" }}
          />
        </div>
        <hr />
        {/* Detalles */}
        <div className="row mb-4 align-items-center">
          <div className="col">
            <label htmlFor="codigo">Codigo</label>
            <input
              type="number"
              id="codigo"
              name="codigo"
              className="form-control"
              style={{ width: "120px" }}
              min={0}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-1">
            <label htmlFor="cantidad">Cantidad</label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              className="form-control"
              value={producto.cantidad}
              min={cantidadMaxima - cantidadMaxima + 1}
              max={cantidadMaxima}
              onChange={(e) => {
                const nuevaCantidad = parseInt(e.target.value);
                if (nuevaCantidad <= cantidadMaxima) {
                  setProducto({
                    ...producto,
                    cantidad: nuevaCantidad,
                  });
                }
              }}
            />
          </div>
          <div className="col-3">
            <label htmlFor="descripcion">Descripcion</label>
            <input
              id="descripcion"
              name="descripcion"
              className="form-control"
              value={producto.descripcion}
              readOnly
              style={{ backgroundColor: "white" }}
            />
          </div>
          <div className="col">
            <label htmlFor="precio-unitario">P. Unitario</label>
            <input
              type="number"
              id="precio-unitario"
              name="precio_unitario"
              className="form-control"
              style={{ width: "150px", backgroundColor: "white" }}
              value={producto.precio}
              readOnly
            />
          </div>
          <div className="col-1">
            <label htmlFor="iva">IVA(%)</label>
            <input
              type="number"
              id="iva"
              name="iva"
              className="form-control"
              value={producto.iva * 100}
              readOnly
              style={{ backgroundColor: "white" }}
            />
          </div>
          <div className="col">
            <label htmlFor="subtotal">Subtotal</label>
            <input
              type="number"
              id="subtotal"
              name="subtotal"
              className="form-control"
              style={{ width: "150px", backgroundColor: "white" }}
              value={producto.precio * producto.cantidad}
              readOnly
            />
          </div>
          <div className="col mt-1">
            <Btn
              id="btn-agregar"
              type="secondary"
              outline
              className="mt-4"
              onClick={handleAgregarItem}
            >
              Agregar Item
            </Btn>
          </div>
        </div>
        <hr />
        <div className={classes.table_container}>
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Descripcion</th>
                <th>P. Unitario(Gs)</th>
                <th>IVA(%)</th>
                <th>Subtotal(Gs)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {detallesParaMostrar.map((detalle, index) => (
                <tr key={index}>
                  <td>{detalle.cantidad}</td>
                  <td>{detalle.descripcion}</td>
                  <td>{detalle.precioUnitario.toLocaleString("es-ES")}</td>
                  <td>
                    {detalle.iva === 0.05
                      ? 5
                      : detalle.iva === 0.1
                      ? 10
                      : detalle.iva}
                  </td>
                  <td>{detalle.subtotal.toLocaleString("es-ES")}</td>
                  <td>
                    <button
                      id="btn-cancelar"
                      type="button"
                      className="btn"
                      onClick={() => handleDeleteDetalle(index)}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={classes.button_container2}>
          <Btn id="btn-guardar" submit type="primary" onClick={handleSubmit}>
            Generar factura
          </Btn>
        </div>
      </form>
      {modalVisible && datosFactura.rucProveedor && (
        <DetalleModalCompra
          factura={datosFactura}
          detallesParaEnviar={detallesParaEnviar}
          detallesParaMostrar={detallesParaMostrar}
          closeModal={() => setModalVisible(false)}
          open={modalVisible}
          resetForm={resetFormulario}
        />
      )}
    </div>
  );
};

export default FacturasFormCompras;
