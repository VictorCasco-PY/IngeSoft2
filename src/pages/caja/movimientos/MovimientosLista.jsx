import { Table } from "../../../components/table/Table";
import { HiOutlinePlusSm } from "react-icons/hi";
import { HiOutlineMinusSm } from "react-icons/hi";
import { precioHandler } from '../../../utils/precioHandler';

export const MovimientosLista = ({ movimientos, select }) => {
    
    const getMonto = (movimiento) => {
        const total = precioHandler(movimiento.total)
        if(movimiento.entrada===true) return <span className="text-success fw-bold"><HiOutlinePlusSm /> {total}</span>;
        return <span className="text-danger fw-bold"><HiOutlineMinusSm /> {total}</span>;
    }

    return <>

        <Table headers={["Nombre", "Fecha", "Nº Factura", "Nombre de Caja", "Total"]}>
        {movimientos?.map(movimiento => {

                return (
                    <tr key={movimiento.movimiento.id} onClick={()=>select(movimiento.movimiento.id)} className={movimiento.movimiento.entrada===true ? "bg-danger" : ""}>
                        <th className="py-3" scope="row">{movimiento.movimiento.comprobanteNombre}</th>
                        <td className="py-3">{movimiento.movimiento.fecha}</td>
                        <td className="py-3">{movimiento.movimiento.comprobanteNumero}</td>
                        <td className="py-3">{movimiento.movimiento.nombreCaja}</td>
                        <td className="py-3">{getMonto(movimiento.movimiento)}</td>
                    </tr>
                )
            })}
        </Table>
    </>
}