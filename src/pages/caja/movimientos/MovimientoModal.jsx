import { Btn } from "../../../components/bottons/Button"
import ModalBase from "../../../components/modals/ModalBase"
import { Table } from "../../../components/table/Table"

export const MovimientoModal = ({ movimiento, open, closeModal }) => {

    return <ModalBase title="Detalle de movimiento" open={open} closeModal={closeModal}>
        <div>
            <p className='py-2'>
                <b>Nombre:</b> {movimiento?.movimiento.comprobanteNombre}<br />
                <b>Fecha de emision:</b> {movimiento?.movimiento.fecha} - {movimiento?.movimiento.hora}<br />
                <b>Número de comprobante:</b> {movimiento?.movimiento.comprobanteNumero}<br />
                <b>Nombre de caja:</b> {movimiento?.movimiento.nombreCaja}<br />
                <b>Cobrado por:</b> {movimiento?.movimiento.nombreEmpleado}<br />
            </p>

            <Table headers={["Tipo de pago", "Monto"]}>
                {movimiento?.detalles.map(detalle => {
                    return (
                        <tr key={detalle.id}>
                            <td className="py-3">{detalle.tipoMovimiento}</td>
                            <td className="py-3">{detalle.monto}</td>
                        </tr>
                    )
                })}
            </Table>
            <div className="d-flex justify-content-center align-items-center float-end mt-4 gap-3">
                <Btn onClick={closeModal}>Cerrar</Btn>
            </div>
        </div>
    </ModalBase>
}