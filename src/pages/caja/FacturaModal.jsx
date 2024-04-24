import { useEffect, useState } from 'react';
import ModalBase from '../../components/modals/ModalBase';
import { Table } from '../../components/table/Table';
import { Btn } from '../../components/bottons/Button';
import { iva } from '../../utils/ivaHandler';
import { precioHandler } from '../../utils/precioHandler';
import { CobrarFacturaModal } from './CobrarFacturaModal';
import { useFactura } from '../../hooks/useFactura';

export const FacturaModal = ({ open, closeModal, data, guardar }) => {

    const [cobroModal, setCobroModal] = useState(false);

    const [factura, setFactura] = useState(data ?? null);

    const { getFacturaById } = useFactura();


    const handleCobroModal = async () => {
        setCobroModal(false);
        setFactura(await getFacturaById(data?.factura?.id));
    }

    useEffect(() => {
        setFactura(data);
    }, [data]);


    return <ModalBase title={`Factura Nº ${factura?.factura?.nroFactura}`} open={open} closeModal={closeModal}>
        <div>
            <p className='py-2'>
                <b>Fecha de emision:</b> {factura?.factura?.fecha}<br />
                <b>Cliente</b> {factura?.factura?.nombreCliente}<br />
                <b>RUC:</b> {factura?.factura?.rucCliente}<br />
                <b>Direccion:</b> {factura?.factura?.direccion}<br />
            </p>

            <Table headers={["Cantidad", "Producto", "Precio", "Iva", "Subtotal"]} textcenter>
                {factura?.detalles?.map(item => (
                    <tr key={item?.id}>
                        <td className="py-3 text-center">{item?.cantidad}</td>
                        <td className="py-3 text-center">{item?.productoNombre}</td>
                        <td className="py-3 text-center">{precioHandler(item?.precioUnitario)}</td>
                        <td className="py-3 text-center">{iva(item?.iva)}</td>
                        <td className="py-3 text-center">{precioHandler(item?.subtotal)}</td>
                    </tr>
                ))}
            </Table>

            <p className='text-end'>
                <b>
                    Total: {precioHandler(factura?.factura?.total)}<br />
                    {factura?.factura?.saldo ? `Saldo: ${precioHandler(factura?.factura?.saldo)}` : "Pagado"}
                </b>
            </p>


            <div className="d-flex justify-content-center align-items-center float-end mt-4 gap-3">
                <Btn id="btn-cerrar" onClick={closeModal} type="secondary">Cerrar</Btn>
                {guardar && <Btn type="secondary" onClick={() => guardar()} outline>Guardar Factura</Btn>}
                {factura?.factura?.saldo ? <Btn id="btn-cobrar-factura" type="primary" onClick={() => setCobroModal(true)}>Cobrar Factura</Btn> : "" }
            </div>

        </div>
        <CobrarFacturaModal data={data} open={cobroModal} closeModal={handleCobroModal} />
    </ModalBase>

}