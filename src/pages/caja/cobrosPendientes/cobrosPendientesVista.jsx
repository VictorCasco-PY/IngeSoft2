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
import { VolverAtras } from "../../../components/bottons/VolverAtras";
import { FacturaModal } from "../FacturaModal";

export const CobrosPendientesVista = () => {
  const [data, setData] = useState([]);
  const [openFacturaModal, setOpenFacturaModal] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  const { isLoading, error, notFound, getFacturasPendientes,getFacturaById } = useFactura();

  const getData = async () => {
    const pendientes = await getFacturasPendientes();
    setData(pendientes);
  };

  const handleOpenFacturaModal = () => {
    setOpenFacturaModal(!openFacturaModal);
  }

  const handleSelectFactura = async(facturaId) => {
    const res = await getFacturaById(facturaId);
    setFacturaSeleccionada(res);
    handleOpenFacturaModal();
  }



  useEffect(() => {
    getData();
  }, []);

  const switchRender = () => {

    if (isLoading) return <Loader />

    if (notFound) return <ListaVacía mensaje="No hay facturas pendientes." />

    if (error) return <ErrorPagina mensaje="Ha ocurrido un error cargando los datos." />

    return (
      <>
        <CobrosPendientesLista facturas={data?.items} select={handleSelectFactura} />
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
      <VolverAtras href="/caja" />
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
    <FacturaModal open={openFacturaModal} facturaId={facturaSeleccionada} closeModal={handleOpenFacturaModal} data={facturaSeleccionada}/>
  </CartaPrincipal>;
};
