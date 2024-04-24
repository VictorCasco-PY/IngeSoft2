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
      <div className="p-2">
        <form className="d-flex gap-4 flex-wrap w-100">
          <span className="d-flex w-50 gap-3">
            <Input id="input-search" placeholder="Buscar..." />
            <Btn id="btn-buscar" outline>
              Buscar
            </Btn>
          </span>
        </form>
      </div>
    </>
  );
};

export default ArqueoHeader;
