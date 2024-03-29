import { useEffect, useState } from "react";
import { useFactura } from "../../../hooks/useFactura";
import { CobrosPendientesLista } from "./cobrosPendientesLista";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";
import Pagination from "../../../components/pagination/PaginationContainer";
import { Input } from "../../../components/input/input";
import { Btn } from "../../../components/bottons/Button";
export const CobrosPendientesVista = () => {
  const [data, setData] = useState([]);

  const { isLoading, error, getFacturasPendientes } = useFactura();

  const getData = async () => {
    const pendientes = await getFacturasPendientes();
    console.log(pendientes);
    setData(pendientes);
  };

  useEffect(() => {
    getData();
  }, []);

  switch (isLoading) {
    case true:
      return <div>Cargando...</div>;
    case false:
      return (
        <CartaPrincipal>
          <h1>Cobros Pendientes</h1>
          <div className="p-2 d-flex justify-content-between">
            <form className="w-50 d-flex gap-4">
              <span className="d-flex gap-3">
                <Input id="input-mindate" placeholder="01/01/2024" type="date" />
                <Input id="input-maxdate" placeholder="31/12/2024"  type="date" />
              </span>
              <span className="d-flex">
              <Input id="input-search" placeholder="Buscar..." />
              <Btn outline>Buscar</Btn>
              </span>
            </form>
            <Btn type="primary">Nuevo Cobro</Btn>
          </div>
          <CobrosPendientesLista facturas={data.items} />
          <Pagination
            totalPages={data.totalPages}
            currentPage={data.currentPage}
            onPageChange={getData}
          />
        </CartaPrincipal>
      );
  }
};
