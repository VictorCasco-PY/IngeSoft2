import { Table } from "../../../components/table/Table";


export const MovimientosLista = ({ movimientos }) => {
    
    const getTipoMovimiento = (movimiento) => {
        if(movimiento.facturaId) return ("Factura");
        if(movimiento.ticketId) return ("Ticket");
        if(movimiento.facturaProveedorId) return ("Pago");
    }

    const getMonto = (movimiento) => {
        if(movimiento.entrada===true) return <span className="text-success">{movimiento.total}</span>;
        return <span className="text-danger">{movimiento.total}</span>;
    }

    return <>
        {console.log(movimientos)}

        <Table headers={["Nombre", "Fecha", "Nº Factura", "Nombre de Caja", "Total"]}>
        {movimientos.map(movimiento => {

                const tipoMovimiento = getTipoMovimiento(movimiento.movimiento);

                console.log(movimiento.movimiento)
                return (
                    <tr key={movimiento.movimiento.id} className={movimiento.movimiento.entrada===true ? "bg-danger" : ""}>
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