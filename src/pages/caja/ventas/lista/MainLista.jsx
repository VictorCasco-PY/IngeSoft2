import React from "react";
import CartaPrincipal from "../../../../components/cartaPrincipal/CartaPrincipal";
import ListaVentas from "./ListaVentas";

const MainLista = () => {
  return (
    <>
      <CartaPrincipal>
        <ListaVentas />
      </CartaPrincipal>
    </>
  );
};

export default MainLista;
