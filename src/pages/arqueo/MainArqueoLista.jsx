import React from "react";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";
import ArqueoListaPage from "./ArqueoListaPage";
import ArqueoHeader from "./ArqueoHeader";

const MainArqueoLista = () => {
  return (
    <CartaPrincipal>
      <ArqueoHeader />
      <ArqueoListaPage />
    </CartaPrincipal>
  );
};

export default MainArqueoLista;
