import { useEffect } from "react";
import FlechaAtras from "../../../components/flechaAtras/FlechaAtras";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";
import TablaCaja from "../../../components/tables/TablaCaja";
import { useComprasCaja } from "../../../context/ComprasCajaState";

import api from "../../../utils/api";

const ListaCompras = () => {
  const { items, addItem } = useComprasCaja(); // Accede a items directamente desde el contexto

  const obtenerFacturas = async () => {
    try {
      // Realiza la solicitud a la API para obtener las facturas
      const response = await api.get(`/facturas-proveedores/page/1`);
      // Agrega las facturas al estado items utilizando addItem del contexto
      response.data.items.forEach((factura) => addItem(factura)); // Utiliza addItem del contexto
      console.log(response.data);
    } catch (error) {
      // Maneja los errores si la solicitud falla
      console.error("Error al obtener las facturas:", error);
    }
  };
  

  useEffect(() => {
    obtenerFacturas();
  }, []);

  return (
    <>
      <CartaPrincipal>
        <div className="d-flex align-items-center" style={{ marginTop: "1.5rem" }}>
          <FlechaAtras ruta="/caja"/>
          <h2 style={{ marginLeft: "3rem" }}>Listar Compras Realizadas</h2>
        </div>
        {/* Pasa las facturas obtenidas como prop al componente TablaCaja */}
        <TablaCaja items={items} />
      </CartaPrincipal>
    </>
  );
};

export default ListaCompras;
