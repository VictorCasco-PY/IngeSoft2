import React from "react";
import { Btn } from "../../components/bottons/Button";
import { Input } from "../../components/input/input";
import FlechaAtras from "../../components/flechaAtras/FlechaAtras";

const ArqueoHeader = () => {
  return (
    <>
      <div
        className="d-flex align-items-center"
        style={{ marginTop: "1.5rem" }}
      >
        <FlechaAtras ruta="/caja" />
        <h1 style={{ marginLeft: "3rem" }}>Historial de Arqueos</h1>
      </div>
    </>
  );
};

export default ArqueoHeader;
