import { Table } from "../../../components/table/Table";
import { precioHandler } from '../../../utils/precioHandler';

export const CobrosPendientesLista = ({ facturas, select }) => {

    return (
        <Table headers={["Nº Factura", "Fecha", "Cliente", "RUC", "Total", "Saldo"]} striped>
            {facturas.map(factura=>{
                return (
                        <tr key={factura.id} onClick={()=>select(factura.id)}>
                            <th className="py-3" scope="row" style={{color:"#7749F8"}}>{factura.nroFactura}</th>
                            <td className="py-3">{factura.fecha}</td>
                            <td className="py-3">{factura.nombreCliente}</td>
                            <td className="py-3">{factura.rucCliente}</td>
                            <td className="py-3">{precioHandler(factura.total)}</td>
                            <td className="py-3">{precioHandler(factura.saldo)}</td>
                        </tr>
            )})}
        </Table>
)

};
