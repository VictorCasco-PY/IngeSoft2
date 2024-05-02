import React, { useState, useEffect } from "react";
import "./MainProductos.css";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { TbArrowDown } from "react-icons/tb";
import { GoQuestion } from "react-icons/go";

import ButtonBasic from "../../components/bottons/ButtonBasic";
import ButtonCrear from "../../components/bottons/ButtonCrear";
import ModalBase from "../../components/modals/ModalBase";
import LabelBase from "../../components/labels/LabelBase";
import CustomAlert from "../../components/alert/CustomAlert";
import StockIndicator from "../../components/ManejoStock/StockIndicador";
import { IoCheckmark } from "react-icons/io5";
import api from "../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import ErrorPagina from "../../components/errores/ErrorPagina";
import Pagination from "../../components/pagination/PaginationContainer";
import ElementoNoEncontrado from "../../components/errores/ElementoNoEncontrado";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";
import useReporteProductos from "../../hooks/useReporteProductos";
import CBadge from "../../components/labels/CBadge";

const MainProductos = () => {
  const [productos, setProductos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [modalMode, setModalMode] = useState("create");
  const [error, setError] = useState(false); // Estado para manejar el error
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultsFound, setSearchResultsFound] = useState(true);
  const [productosData, setProductosData] = useState({
    nombre: "",
    descripcion: "",
    codigo: "",
    costo: "",
    cantidad: "",
    cantidadLimite: "",
    precio: "",
    iva: "",
  });
  const tipo_iva = [
    { label: "0%", value: 0 },
    { label: "5%", value: 0.05 },
    { label: "10%", value: 0.1 },
  ];
  useEffect(() => {
    fetchProductos(currentPage);
  }, [currentPage]);

  const fetchProductos = async (page) => {
    try {
      const response = await api.get(`/productos/page/${page}`);
      setProductos(response.data.items);
      setFilteredProductos(response.data.items);
      setTotalPages(response.data.totalPages);
      setError(false);
    } catch (error) {
      setError(true);
      console.error("Error al obtener los productos:", error);
    }
  };
  //Seccion donde esta la logica de la busqueda
  const searchProductos = async (term) => {
    try {
      const response = await api.get(
        `/productos/search/${term}/page/${currentPage}`
      );
      const filtered = response.data.items;
      setFilteredProductos(filtered);
      setSearchResultsFound(filtered.length > 0); // Si la longitud de 'filtered' es cero, establece 'searchResultsFound' en true
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Mostrar un mensaje de "Producto no encontrado" cuando el servidor devuelve un 404
        setFilteredProductos([]); // Establecer los productos filtrados como vacíos
        setSearchResultsFound(false); // Indicar que no se encontraron resultados
      } else {
        // Manejar otros errores de manera similar a como lo haces actualmente
        setSearchResultsFound(true);
        console.error("Error al buscar productos por nombre:", error);
      }
    }
  };

  const handleFilterByPriceRange = async (minPrice, maxPrice) => {
    // Validar que los valores no sean negativos
    if (minPrice < 0 || maxPrice < 0) {
      toast.error("Los valores no pueden ser negativos");
      return;
    }
    try {
      // Realizar búsqueda por rango de precios
      const response = await api.get(
        `/productos/search/${minPrice}/${maxPrice}/page/${currentPage}`
      );
      const filtered = response.data.items;
      setFilteredProductos(filtered);
      setSearchResultsFound(filtered.length > 0);
      // Mostrar mensaje si no hay productos en el rango especificado
      if (filtered.length === 0) {
        toast.error("No hay productos en el rango de precios especificado");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Mostrar un mensaje de "Producto no encontrado" cuando el servidor devuelve un 404
        setFilteredProductos([]); // Establecer los productos filtrados como vacíos
        setSearchResultsFound(false); // Indicar que no se encontraron resultados
      } else {
        // Manejar otros errores de manera similar a como lo haces actualmente
        setSearchResultsFound(true);
        console.error("Error al buscar productos por precio:", error);
        toast.error("Error al buscar productos por precio");
      }
    }
  };

  const handleSearchClick = () => {
    searchProductos(searchQuery);
  };

  const handleInputChange = (event) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);

    if (newSearchQuery === "") {
      // Si el input de búsqueda está vacío, vuelve a la primera página
      setCurrentPage(1);
      setFilteredProductos(productos);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleNuevoProducto = () => {
    setModalMode("create"); // Establece el modo como crear
    setProductosData({
      nombre: "",
      descripcion: "",
      codigo: "",
      costo: "",
      cantidad: "",
      cantidadLimite: "",
      precio: "",
    });
    setShowModal(true);
  };

  // Función para abrir el modal de edición y cargar los datos del producto
  const handleEditarProducto = (producto) => {
    setModalMode("edit"); // Establece el modo como editar
    setProductosData(producto); // Establece los datos del producto a editar en el estado
    setShowEditModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditModal(false);
  };

  const handleCampoChange = (event) => {
    const { name, value } = event.target;

    // Verificar si el campo es cantidad, costo, precio o código
    if (name === "cantidad" || name === "cantidadLimite" || name === "costo" || name === "precio") {
      let formattedValue = value.replace(/\D/g, ""); // Eliminar todos los caracteres que no sean dígitos
      formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Agregar puntos para separar los miles
      // Verificar si el valor es negativo y no permitirlo
      if (parseFloat(value) < 0) {
        toast.error("No se admiten valores negativos en ningún campo");
        return;
      }
      setProductosData((prevData) => ({
        ...prevData,
        [name]: formattedValue, // Usar el valor formateado en lugar del valor original
      }));
    } else if (name === "codigo") {
      // Verificar el campo de código para asegurarse de que solo contiene números enteros
      const formattedValue = value.replace(/\D/g, ""); // Eliminar todos los caracteres que no sean dígitos
      setProductosData((prevData) => ({
        ...prevData,
        [name]: formattedValue, // Usar el valor formateado en lugar del valor original
      }));
    } else if (name === "iva") {
      // Manejar el cambio en el campo de IVA
      setProductosData((prevData) => ({
        ...prevData,
        [name]: parseFloat(value), // Convertir el valor a número y guardar en el estado
      }));
    } else {
      // Si el campo no es cantidad, costo, precio, código o IVA, simplemente actualizar el estado con el valor ingresado
      setProductosData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Función para manejar el cambio en los campos de precio mínimo y máximo
  const handlePriceInputChange = (event, setter) => {
    let value = event.target.value;

    // Eliminar todos los caracteres que no sean dígitos o un punto
    value = value.replace(/[^\d.]/g, "");

    // Validar el formato del número
    const parts = value.split(".");
    if (parts.length > 2) {
      // Si hay más de un punto, solo se permite uno y se elimina el resto
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Asignar el valor al estado
    setter(value);
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAceptar = async () => {
    try {
      // Eliminar los puntos de los valores formateados antes de enviarlos al servidor
      const dataToSend = {
        ...productosData,
        cantidad: parseFloat(
          productosData.cantidad.toString().replace(/\./g, "")
        ),
        cantidadLimite: parseFloat(
          productosData.cantidadLimite.toString().replace(/\./g, "")
        ),
        costo: parseFloat(productosData.costo.toString().replace(/\./g, "")),
        precio: parseFloat(productosData.precio.toString().replace(/\./g, "")),
      };

      // Validar el campo código para asegurarse de que tenga al menos 6 caracteres y solo números enteros
      if (modalMode === "create") {
        // Validar la longitud del código
        if (productosData.codigo.length != 6) {
          toast.error("El código solo puede tener 6 caracteres.");
          return;
        }
        // Validar que el código contenga solo números enteros
        if (!/^\d+$/.test(productosData.codigo)) {
          toast.error("El código debe contener solo números enteros.");
          return;
        }
        const codigoExists = productos.some(
          (producto) =>
            producto.codigo.toLowerCase() === productosData.codigo.toLowerCase()
        );
        if (codigoExists) {
          toast.error("El código del producto ya está en uso.");
          return;
        }
      }

      // Validar que el precio no sea menor que el costo
      if (parseFloat(dataToSend.precio) < parseFloat(dataToSend.costo)) {
        toast.error("El precio no puede ser menor que el costo.");
        return;
      }

      let response;
      if (modalMode === "create") {
        response = await api.post("/productos", dataToSend);
        console.log("Producto creado:", response.data);
        toast.success("Producto creado satisfactoriamente");
      } else if (modalMode === "edit") {
        // Verificar si se realizaron cambios
        const editedProducto = productos.find(
          (producto) => producto.id === productosData.id
        );
        if (
          editedProducto.nombre === productosData.nombre &&
          editedProducto.descripcion === productosData.descripcion &&
          editedProducto.codigo === productosData.codigo &&
          editedProducto.costo === dataToSend.costo &&
          editedProducto.cantidad === dataToSend.cantidad &&
          editedProducto.cantidadLimite === dataToSend.cantidadLimite &&
          editedProducto.precio === dataToSend.precio &&
          editedProducto.iva === dataToSend.iva
        ) {
          toast.promise(new Promise((resolve) => resolve()), {
            loading: "Guardando...",
            success: "No se realizó ningún cambio en el producto.",
            error: "Hubo un error al guardar los cambios.",
          });
          return;
        }
        response = await api.put(`/productos/${productosData.id}`, dataToSend);
        console.log("Producto editado:", response.data);
        toast.success("Producto actualizado satisfactoriamente");

        setStockReloadBool(!stockReloadBool); //recargar la cantidad de productos sin stock cada vez que se edita
      }

      setShowModal(false);
      setShowEditModal(false);
      fetchProductos(currentPage);
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      toast.error("Error al procesar la solicitud");
    }
  };
  const handleEliminarProducto = async () => {
    if (productoToDelete) {
      try {
        await api.delete(`/productos/${productoToDelete.id}`);

        fetchProductos(currentPage);
        toast.success("Producto eliminado satisfactoriamente");
      } catch (error) {
        toast.error("Error al eliminar el producto");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (productoToDelete) {
      try {
        await handleEliminarProducto();
        setShowAlert(false);
      } catch (error) {
        toast.error("Error al eliminar producto" + error);
      }
    }
  };

  const handleShowAlert = (producto) => {
    setProductoToDelete(producto);
    setShowAlert(true);
  };

  const handleCancelDelete = () => {
    setShowAlert(false); // Oculta la alerta
  };

  //inicio badge de cantidad de productos sin stock
  const [cantidadProductosSinStock, setCantidadProductosSinStock] = useState(0);
  const [stockReloadBool, setStockReloadBool] = useState(false);
  const { getCantidadProductosSinStock, isLoading: isLoadingProductosSinStock } = useReporteProductos();

  useEffect(() => {
    const fetchCantidadProductosSinStock = async () => {
      try {
        const response = await getCantidadProductosSinStock();
        setCantidadProductosSinStock(response);
      } catch (error) {
        toast.error("Error al obtener la cantidad de productos sin stock");
      }
    };
    fetchCantidadProductosSinStock();
  }, [stockReloadBool]);
  //fin badge de cantidad de productos sin stock

  return (
    <>
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

      <CartaPrincipal>
        <div>

          <div className="d-flex">
            <h1>Tienda</h1>
            {cantidadProductosSinStock > 0 && (
              <CBadge type="warning" style={{ margin: 'auto' }} title="Aviso" loading={isLoadingProductosSinStock}>
                Ya no hay stock de <b>{cantidadProductosSinStock} {cantidadProductosSinStock > 1 ? 'productos' : 'producto'}</b>
              </CBadge>
            )}
          </div>

          <div className="card-body d-flex align-items-center ">
            <form className="d-flex flex-grow-1 align-items-center">
              <input
                id="input-search"
                className="form-control custom-input"
                type="text"
                placeholder="Buscar producto en tienda..."
                value={searchQuery}
                onChange={handleInputChange}
              />
              <ButtonBasic
                id="btn-buscar"
                text="Buscar"
                onClick={handleSearchClick}
              />
            </form>
            <div className="dropdown">
              <button
                id="btn-filtrar"
                type="button"
                className="btn btn-secundary dropdown-toggle btn-filtrar"
                data-bs-toggle="dropdown"
                style={{ fontSize: "1.02rem" }}
              >
                <IoCheckmark />
                Filtrar por Precio
              </button>
              <ul className="dropdown-menu">
                <form className=" px-2 ">
                  <div className="mb-3">
                    <label htmlFor="minPrice" className="form-label">
                      Precio mínimo
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="minPrice"
                      value={minPrice}
                      onChange={(e) => handlePriceInputChange(e, setMinPrice)}
                    />
                  </div>

                  <label htmlFor="maxPrice" className="form-label">
                    Precio máximo
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="maxPrice"
                    value={maxPrice}
                    onChange={(e) => handlePriceInputChange(e, setMaxPrice)}
                  />
                  <div className="d-grid">
                    <ButtonCrear
                      id="btn-filtar-aplicar"
                      text="Aplicar"
                      onClick={() =>
                        handleFilterByPriceRange(
                          parseFloat(minPrice),
                          parseFloat(maxPrice)
                        )
                      }
                    />
                  </div>
                </form>
              </ul>
            </div>

            <ButtonCrear
              id="btn-crear"
              text="Nuevo Producto"
              onClick={handleNuevoProducto}
              icon={<IoAdd />}
              color="secondary"
            />
          </div>
        </div>

        <ModalBase
          open={showModal || showEditModal}
          closeModal={handleCloseModal}
          title={showModal ? "Crear Nuevo Producto" : "Editar Producto"}
        >
          <form className="mb-3">
            <div className="mb-2 block">
              <div className="label-container">
                <LabelBase label="Nombre:" htmlFor="nombre" />
                <span className="required">*</span>
              </div>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-control"
                value={productosData.nombre}
                onChange={handleCampoChange}
                required
              />
            </div>
            <div className="mb-2 block">
              <div className="label-container">
                <LabelBase label="Descripción:" htmlFor="descripcion" />
                {/* No se requiere asterisco para campos opcionales */}
              </div>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                className="form-control"
                value={productosData.descripcion}
                onChange={handleCampoChange}
                maxLength={40}
              ></input>
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column">
                <div className="mb-3 block">
                  {" "}
                  {/* Incrementé el margen inferior */}
                  <div className="label-container">
                    <LabelBase label="Código:" htmlFor="codigo" />
                    <span className="required">*</span>
                  </div>
                  <input
                    type="number"
                    id="codigo"
                    name="codigo"
                    className="form-control custom-input"
                    style={{ width: "100%" }}
                    value={productosData.codigo}
                    onChange={handleCampoChange}
                    required
                  />
                </div>
                <div className="mb-3 block">
                  <div className="label-container">
                    <LabelBase label="Cantidad:" htmlFor="cantidad" />
                    <span className="required">*</span>
                  </div>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    className="form-control custom-input"
                    style={{ width: "100%" }}
                    value={productosData.cantidad}
                    onChange={handleCampoChange}
                    required
                  />
                </div>
                <div className="mb-3 block">
                  <div className="label-container">
                    <LabelBase label="Precio:" htmlFor="precio" />
                    <span className="required">*</span>
                  </div>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    className="form-control custom-input"
                    style={{ width: "100%" }}
                    value={productosData.precio}
                    onChange={handleCampoChange}
                    required
                  />
                </div>
              </div>
              <div className="d-flex flex-column">
                <div className="mb-3 block">
                  <div className="label-container">
                    <LabelBase label="Costo:" htmlFor="costo" />
                    <span className="required">*</span>
                  </div>
                  <input
                    type="number"
                    id="costo"
                    name="costo"
                    className="form-control custom-input"
                    style={{ width: "100%" }}
                    value={productosData.costo}
                    onChange={handleCampoChange}
                    required
                  />
                </div>
                <div className="mb-3 block">
                  <div className="label-container">
                    <LabelBase label="Cantidad límite:" htmlFor="cantidadLimite" />
                    <span className="required">*</span>
                  </div>
                  <input
                    type="number"
                    id="cantidadLimite"
                    name="cantidadLimite"
                    className="form-control custom-input"
                    style={{ width: "100%" }}
                    value={productosData.cantidadLimite}
                    onChange={handleCampoChange}
                    required
                  />
                </div>
                <div className="mb-3 block">
                  <div className="label-container">
                    <LabelBase label="IVA:" htmlFor="iva" />
                    <span className="required">*</span>
                  </div>
                  <select
                    id="iva"
                    name="iva"
                    className="form-control form-select"
                    value={productosData.iva}
                    onChange={handleCampoChange}
                  >
                    {tipo_iva.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="campo-obligatorio">
              <span className="required">*</span>
              <span className="message">Campo obligatorio</span>
            </div>
            <div className="d-flex justify-content-center align-items-center float-end">
              <button
                type="button"
                id="btn-cancelar"
                className="btn-cancelar"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <ButtonCrear
                id="btn-guardar"
                text="Aceptar"
                onClick={() => handleAceptar()}
              />
            </div>
          </form>
        </ModalBase>

        {showAlert && productoToDelete && (
          <CustomAlert
            message={`¿Estás seguro de eliminar el producto ${productoToDelete.nombre}?`}
            confirmText="Aceptar"
            cancelText="Cancelar"
            confirmAction={handleConfirmDelete}
            cancelAction={handleCancelDelete}
          />
        )}
        <div class="table-container">
          {error && <ErrorPagina mensaje="No hay pruductos cargados aún " />}
          {/* Muestra el componente de error si hay un error */}
          {!error && filteredProductos.length === 0 && !searchResultsFound && (
            <ElementoNoEncontrado mensaje="¡Producto no encontrado!" />
          )}
          {!error && filteredProductos.length === 0 && searchResultsFound && (
            <ElementoNoEncontrado mensaje="Todavia no hay productos cargados" />
          )}
          {!error && filteredProductos.length > 0 && (
            <table className="custom-table">
              <thead>
                <tr>
                  <th scope="col">Nombre del Producto</th>
                  <th scope="col">
                    Stock <TbArrowDown />
                  </th>
                  <th scope="col">
                    Codigo <GoQuestion />
                  </th>
                  <th scope="col">Descripcion</th>
                  <th scope="col">Precio(Gs)</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>
                      <StockIndicator stock={producto.cantidad} cantidadLimite={producto.cantidadLimite} />
                    </td>
                    <td>{producto.codigo}</td>
                    <td>{producto.descripcion}</td>
                    <td>{formatNumber(producto.precio)}</td>
                    <td class="text-center">
                      <a
                        id={`btn-eliminar-producto-${producto.id}`}
                        href="#"
                        onClick={() => handleShowAlert(producto)}
                        style={{ fontSize: "1.2rem" }}
                      >
                        <RiDeleteBinLine />
                      </a>
                      <a
                        id={`btn-editar-producto-${producto.id}`}
                        href="#"
                        onClick={() => handleEditarProducto(producto)}
                        style={{ marginLeft: "1.5em", fontSize: "1.2rem" }}
                      >
                        <FiEdit2 />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </CartaPrincipal>
    </>
  );
};

export default MainProductos;
