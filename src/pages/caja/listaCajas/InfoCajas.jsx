import React, { useEffect, useState } from 'react';
import { Table } from '../../../components/table/Table';
import useCaja from '../../../hooks/useCaja';
import toast from 'react-hot-toast';
import CajaStorage from '../../../utils/CajaStorage';
import UserStorage from '../../../utils/UserStorage';
import CartaPrincipal from '../../../components/cartaPrincipal/CartaPrincipal';
import Pagination from '../../../components/pagination/PaginationContainer';
import { precioHandler } from '../../../utils/precioHandler';
import FlechaAtras from '../../../components/flechaAtras/FlechaAtras';
import { CircularProgress } from '@mui/material';
import { ListaVacía } from '../../../components/errores/ListaVacía';
import ErrorPagina from '../../../components/errores/ErrorPagina';
import { Loader } from '../../../components/layout/Loader';
import { Btn } from '../../../components/bottons/Button';
import { Input } from '../../../components/input/input';

const InfoCajas = () => {

    const { getAllCajas, searchCajaByName, data: req_cajas, isLoading: cargandoCajas, error: errorCajas, noCajasError } = useCaja();
    const [currentPage, setCurrentPage] = useState(1);
    const [cajas, setCajas] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const [searchQuery, setSearchQuery] = useState('');

    const fetchCajas = async () => {
        if (currentPage > totalPages) { //si la pagina actual es mayor a la ultima pagina, resetear a 1
            setTotalPages(1);
        }
        if (searchQuery) { //si hay query de busqueda
            const res = await searchCajaByName(searchQuery, currentPage);
            setTotalPages(res.totalPages);
            setCajas(res.items);
        } else { //si no hay query de busqueda
            const res = await getAllCajas(currentPage);
            setTotalPages(res.totalPages);
            setCajas(res.items);
        }
    }

    useEffect(() => {
        //si ya se abrio una caja, ir a administración
        if (!(CajaStorage.getCajaId() && CajaStorage.getSesionCajaId())) { //si no hay caja abierta
            if (UserStorage.getUser()) {
                fetchCajas()
                if (errorCajas) {
                    toast.error("Error al cargar cajas. Revise la conexión.");
                }
            } else {
                toast.error("No has iniciado sesión...")
            }
        } else {
            toast.error("Ya tienes una caja abierta, no deberías de estar viendo esto...")
        }
    }, [currentPage])

    const switchRender = () => {

        if (cargandoCajas) return <div className='' style={{ minHeight: 435 }}><Table headers={["Nombre", "Monto de la Caja"]} striped>
            <tr>
                <td className="py-3"><CircularProgress /></td><td className="py-3"><CircularProgress /></td>
            </tr>
            <tr>
                <td className="py-3"><CircularProgress /></td><td className="py-3"><CircularProgress /></td>
            </tr>
            <tr>
                <td className="py-3"><CircularProgress /></td><td className="py-3"><CircularProgress /></td>
            </tr>
            <tr>
                <td className="py-3"><CircularProgress /></td><td className="py-3"><CircularProgress /></td>
            </tr>
            <tr>
                <td className="py-3"><CircularProgress /></td><td className="py-3"><CircularProgress /></td>
            </tr>
        </Table><Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}>
            </Pagination></div>

        if (noCajasError) return <ListaVacía mensaje="No existen cajas registradas." /> //todo: el mensaje retornado del back no es correcto, se muestra "no hay actividades en la lista", deberia mostrar "No hay cajas en la lista"

        if (errorCajas) return <ErrorPagina mensaje="Ha ocurrido un error al solicitar las cajas, revise la conexión." />

        return (
            <>
                <div className='' style={{ minHeight: 435 }}>
                    <Table headers={["Nombre", "Número de Caja", "Número de Factura", "Monto de la Caja"]} striped>
                        {cajas.map(caja => {
                            return (
                                <tr key={caja.id} onClick={() => select(caja.id)}>
                                    <th className="py-3" scope="row" style={{ color: "#7749F8" }}>{caja.nombre}</th>
                                    <td className="py-3">{caja.numeroCaja}</td>
                                    <td className="py-3">{caja.numeroFactura ? caja.numeroFactura : "No tiene"}</td>
                                    <td className="py-3">{precioHandler(caja.monto)}</td>
                                </tr>
                            )
                        })}
                    </Table>
                </div>
                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}></Pagination>
            </>
        );
    };

    return (
        <CartaPrincipal>
            <div className='d-flex align-items-center gap-3'>
                <FlechaAtras ruta='/caja' />
                <h1>Lista de Cajas Creadas</h1>
            </div>
            <div className="p-2">
                <form className="d-flex gap-4 flex-wrap w-100">
                    <span className="d-flex w-50 gap-3">
                        <Input id="input-search" placeholder="Buscar caja..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <Btn outline onClick={fetchCajas}>Buscar</Btn>
                    </span>
                </form>
            </div>
            {switchRender()}
        </CartaPrincipal>
    );
};

export default InfoCajas;