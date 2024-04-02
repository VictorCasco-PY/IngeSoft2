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

const InfoCajas = () => {

    const { getAllCajas, data: req_cajas, isLoading: cargandoCajas, error: errorCajas } = useCaja();
    const [currentPage, setCurrentPage] = useState(1);
    const [cajas, setCajas] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCajas = async () => {
        if (currentPage > totalPages) {
            setTotalPages(1);
        }
        const res = await getAllCajas(currentPage);
        setTotalPages(res.totalPages);
        setCajas(res.items);
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

        if (errorCajas) return <ListaVacía mensaje="Ha ocurrido un error al solicitar las cajas." />

        if (cajas.length <= 0) return <ErrorPagina mensaje="No hay cajas registradas." />

        return (
            <>
                <div className='' style={{ minHeight: 435 }}>
                    <Table headers={["Nombre", "Monto de la Caja"]} striped>
                        {cajas.map(caja => {
                            return (
                                <tr key={caja.id} onClick={() => select(caja.id)}>
                                    <th className="py-3" scope="row" style={{ color: "#7749F8" }}>{caja.nombre}</th>
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
            {switchRender()}
        </CartaPrincipal>
    );
};

export default InfoCajas;