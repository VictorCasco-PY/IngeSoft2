import { useEffect, useState } from "react";
import { useFactura } from "../../../hooks/useFactura";
import { CobrosPendientesLista } from "./cobrosPendientesLista";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";
import Pagination from "../../../components/pagination/PaginationContainer";
import { Input } from "../../../components/input/input";
import { Btn } from "../../../components/bottons/Button";
import ErrorPagina from "../../../components/errores/ErrorPagina";
import { ListaVacía } from "../../../components/errores/ListaVacía";
import { Loader } from "../../../components/layout/Loader";
import { VolverAtras } from "../../../components/bottons/VolverAtras";
import { FacturaModal } from "../FacturaModal";

export const CobrosPendientesVista = () => {
  const [data, setData] = useState([]);
  const [openFacturaModal, setOpenFacturaModal] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [search, setSearch] = useState('');

  const { isLoading, error, notFound, getFacturasPendientes, getSearchFacturaPendienteByNombre, getFacturaById } = useFactura();

  const getData = async () => {
    const pendientes = await getFacturasPendientes();
    setData(pendientes);
  };

  const handleFacturaModal = () => {
    setOpenFacturaModal(false);
  }
  
  const handleSelectFactura = async (facturaId) => {
    const res = await getFacturaById(facturaId);
    setFacturaSeleccionada(res);
    setOpenFacturaModal(true);
  }

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      getData();
      return;
    }
  }

  const handleSearch = async () => {
    if (search === "") {
      getData();
      return;
    }

    const res = await getSearchFacturaPendienteByNombre(search);
    setData(res);
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
          <Input id="input-search" placeholder="Buscar..." onChange={e => handleSearchInput(e)} />
          <Btn outline onClick={handleSearch}>Buscar</Btn>
        </span>
      </form>
    </div>


    {switchRender()}
    <FacturaModal open={openFacturaModal} facturaId={facturaSeleccionada} closeModal={handleFacturaModal} data={facturaSeleccionada} />
  </CartaPrincipal>;
};
