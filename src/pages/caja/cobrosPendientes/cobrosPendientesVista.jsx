import { useEffect, useState } from "react";
import { useFactura } from "../../../hooks/useFactura";
import { CobrosPendientesLista } from "./cobrosPendientesLista";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";
import Pagination from "../../../components/pagination/PaginationContainer";
import { Input } from "../../../components/input/input";
import { Btn } from "../../../components/bottons/Button";
import { HiArrowSmLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import ErrorPagina from "../../../components/errores/ErrorPagina";
import { ListaVacía } from "../../../components/errores/ListaVacía";
import { Loader } from "../../../components/layout/Loader";

export const CobrosPendientesVista = () => {
  const [data, setData] = useState([]);

  const { isLoading, error, notFound, getFacturasPendientes } = useFactura();

  const getData = async () => {
    const pendientes = await getFacturasPendientes();
    console.log(pendientes);
    setData(pendientes);
  };

  useEffect(() => {
    getData();
  }, []);

  const switchRender = () => {

    if (isLoading) return <Loader />

    if (notFound) return <ListaVacía mensaje="No hay facturas pendientes." />

    if (error) return <ErrorPagina mensaje="Ha ocurrido un error cargando los datos." />

    return (
      <>
        <CobrosPendientesLista facturas={data?.items} />
        <Pagination
          totalPages={data?.totalPages}
          currentPage={data?.currentPage}
          onPageChange={getData}
        />
      </>
    );
  };

  return <CartaPrincipal>
    <h1>
      <Link to="/caja">
        <HiArrowSmLeft />
      </Link>
      Cobros Pendientes
    </h1>

    {/* Menú de búsqueda */}
    <div className="p-2">
      <form className="d-flex gap-4 flex-wrap w-100">


        {/* No implementado aún */}
        {/* 
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
        </span> */}


        <span className="d-flex w-50 gap-3">
          <Input id="input-search" placeholder="Buscar..." />
          <Btn outline>Buscar</Btn>
        </span>
      </form>
    </div>


    {switchRender()}
  </CartaPrincipal>;
};
