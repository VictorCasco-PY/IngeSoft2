import { useEffect, useState } from "react";
import { useFactura } from "../../../hooks/useFactura";
import { CobrosPendientesLista } from "./cobrosPendientesLista";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";
import Pagination from "../../../components/pagination/PaginationContainer";
import { Input } from "../../../components/input/input";
import { Btn } from "../../../components/bottons/Button";
import { HiArrowSmLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

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

  const switchRender = () => {

    if(error){}

    
        return (
          <>
            <h1>
              {" "}
              <Link to="/caja">
                <HiArrowSmLeft />
              </Link>{" "}
              Cobros Pendientes
            </h1>

            <div className="p-2 d-flex justify-content-between">
              <form className="d-flex gap-4  flex-wrap w-100">
                <span className="d-flex gap-3">
                  <Input
                    id="input-mindate"
                    placeholder="01/01/2024"
                    type="date"
                  />
                  <Input
                    id="input-maxdate"
                    placeholder="31/12/2024"
                    type="date"
                  />
                </span>
                <span className="d-flex">
                  <Input id="input-search" placeholder="Buscar..." />
                  <Btn outline>Buscar</Btn>
                </span>
              </form>
            </div>

            <CobrosPendientesLista facturas={data.items} />

            <Pagination
              totalPages={data.totalPages}
              currentPage={data.currentPage}
              onPageChange={getData}
            />
          </>
        );
    }

  return <CartaPrincipal isLoading={isLoading}>{switchRender()}</CartaPrincipal>;
};
