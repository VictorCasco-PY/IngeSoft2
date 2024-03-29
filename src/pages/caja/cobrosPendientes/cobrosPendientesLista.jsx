import { Table } from "../../../components/table/Table";

export const CobrosPendientesLista = ({ facturas }) => {

    return (
        <Table headers={["Nº Factura", "Fecha", "Cliente", "RUC", "Total", "Saldo"]}>
            <tbody>
            {facturas.map(factura=>{
                return (
                        <tr key={factura.id}>
                            <th className="py-3" scope="row" style={{color:"#7749F8"}}>{factura.nroFactura}</th>
                            <td className="py-3">{factura.fecha}</td>
                            <td className="py-3">{factura.nombreCliente}</td>
                            <td className="py-3">{factura.rucCliente}</td>
                            <td className="py-3">{factura.total}</td>
                            <td className="py-3">{factura.saldo}</td>
                        </tr>
            )})}
            </tbody>
        </Table>
)

};
