import { useEffect, useState } from "react";
import { useMovimientos } from "../../../hooks/useMovimientos";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";
import { Input } from "../../../components/input/input";
import { Btn } from "../../../components/bottons/Button";
import { Loader } from "../../../components/layout/Loader";
import ErrorPagina from "../../../components/errores/ErrorPagina";
import { ListaVacía } from "../../../components/errores/ListaVacía";
import { MovimientosLista } from "./MovimientosLista";

export const MovimientosVista = () => {

    const { getMovimientos, isLoading, error, notFound } = useMovimientos();
    const [movimientos, setMovimientos] = useState([]);
    const [search, setSearch] = useState('');

    const getData = async () => {
        const data = await getMovimientos();
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

    useEffect(() => {
        getData();
    }, []);


    const switchRender = () => {
        if (isLoading) return <Loader />
        if (error) return <ErrorPagina error={error} />
        if (notFound) return <ListaVacía />
        return <MovimientosLista movimientos={movimientos.items} />
    }


    return <CartaPrincipal>
        <h1>Historial de Movimientos</h1>
        <div className="p-2">
            <form className="d-flex gap-4 flex-wrap w-100">
                <span className="d-flex w-50 gap-3">
                    <Input id="input-search" placeholder="Buscar..." onChange={e => handleSearchInput(e)} />
                    <Btn outline onClick={handleSearch}>Buscar</Btn>
                </span>
            </form>
        </div>
        {switchRender()}
    </CartaPrincipal>

}