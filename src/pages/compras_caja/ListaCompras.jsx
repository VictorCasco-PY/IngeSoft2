import FlechaAtras from "../../components/flechaAtras/FlechaAtras";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";
import TablaCaja from "../../components/tables/TablaCaja";

import { useComprasCaja } from "./context/ComprasCajaState";

const ListaCompras = () => {
  const {items} = useComprasCaja();
  return (
    <>
      <CartaPrincipal>
        <div
          className="d-flex align-items-center"
          style={{ marginTop: "1.5rem" }}
        >
          <FlechaAtras />
          <h2 style={{ marginLeft: "3rem" }}>Listar Compras Realizadas</h2>
        </div>
        <TablaCaja items={items}/>
      </CartaPrincipal>
    </>
  );
};

export default ListaCompras;
