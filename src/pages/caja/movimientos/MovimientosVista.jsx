import { useEffect, useState } from "react";
import { useMovimientos } from "../../../hooks/useMovimientos";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";
import { Input } from "../../../components/input/input";
import { Btn } from "../../../components/bottons/Button";
import { Loader } from "../../../components/layout/Loader";
import ErrorPagina from "../../../components/errores/ErrorPagina";
import { ListaVacía } from "../../../components/errores/ListaVacía";
import { MovimientosLista } from "./MovimientosLista";
import Pagination from "../../../components/pagination/PaginationContainer";
import { MovimientoModal } from "./MovimientoModal";


export const MovimientosVista = () => {

    const { getMovimientos, getMovimientoPorId, isLoadingList, error, notFound } = useMovimientos();
    const [movimientos, setMovimientos] = useState([]);
    const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');

    const getData = async (page = 1) => {
        const data = await getMovimientos(page);
        setMovimientos(data);
    }

    const handleSearchInput = (e) => {
        setSearch(e.target.value);
    }

    const handleSearch = async () => {
        if (search === "") {
            getData();
            return;
        }
        // const res = await getSearchFacturaPendienteByNombre(search);
        // setData(res);
    }

    const handleSelectMovimiento = async (movimientoId) => {
        const res = await getMovimientoPorId(movimientoId);
        setMovimientoSeleccionado(res);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setMovimientoSeleccionado(null);
        setShowModal(false);
    }

    useEffect(() => {
        getData();
    }, []);


    const switchRender = () => {
        if (isLoadingList) return <Loader />
        if (error) return <ErrorPagina error={error} />
        if (notFound) return <ListaVacía />
        return <>
            <MovimientosLista movimientos={movimientos.items} select={handleSelectMovimiento} />
            <Pagination
                totalPages={movimientos.totalPages}
                currentPage={movimientos.currentPage}
                onPageChange={getData}
            />
        </>
    }


    return <CartaPrincipal>
        <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center justify-content-center gap-3 flex-column">
                <h1>Historial de Movimientos</h1>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-3">
                <Btn id="btn-caja-actual">
                    Ver historial de caja actual
                </Btn>
            </div>
        </div>
        <div className="p-2">
            <form className="d-flex gap-4 flex-wrap w-100">
                <span className="d-flex w-50 gap-3">
                    <Input id="input-search" placeholder="Buscar..." onChange={e => handleSearchInput(e)} />
                    <Btn id="btn-buscar" outline onClick={handleSearch}>Buscar</Btn>
                </span>
            </form>
        </div>
        {switchRender()}
        <MovimientoModal movimiento={movimientoSeleccionado} open={showModal} closeModal={handleCloseModal} />
    </CartaPrincipal>

}