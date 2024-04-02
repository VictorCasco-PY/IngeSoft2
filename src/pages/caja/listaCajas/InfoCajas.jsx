import React, { useEffect, useState } from 'react';
import { Table } from '../../../components/table/Table';
import useCaja from '../../../hooks/useCaja';
import toast from 'react-hot-toast';
import CajaStorage from '../../../utils/CajaStorage';
import UserStorage from '../../../utils/UserStorage';
import CartaPrincipal from '../../../components/cartaPrincipal/CartaPrincipal';
import Pagination from '../../../components/pagination/PaginationContainer';
import { precioHandler } from '../../../utils/precioHandler';

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

    return (
        <CartaPrincipal>
            <h1>Lista de Cajas Creadas</h1>
            <div style={{minHeight:343}}>
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
        </CartaPrincipal>
    );
};

export default InfoCajas;