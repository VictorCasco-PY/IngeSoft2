import { useEffect, useState } from 'react';
import ModalBase from '../../components/modals/ModalBase';
import { useFactura } from '../../hooks/useFactura';
import { Table } from '../../components/table/Table';
import { Btn } from '../../components/bottons/Button';

// children, title, closeModal, open
export const FacturaModal = ({ open, closeModal, data, guardar, facturaId }) => {

    const [producto, setProducto] = useState(null);

    return <ModalBase title={`Factura Nº ${data?.factura?.nroFactura}`} open={open} closeModal={closeModal}>
        <div>
            <p className='py-2'>
                <b>Fecha de emision:</b> {data?.factura?.fecha}<br />
                <b>Cliente</b> {data?.factura?.nombreCliente}<br />
                <b>RUC:</b> {data?.factura?.rucCliente}<br />
                <b>Direccion:</b> {data?.factura?.direccion}<br />
            </p>

            <Table headers={["Cantidad", "Producto", "Precio", "Iva", "Subtotal"]} textcenter>
                {data?.detalles?.map(item => (
                    <tr key={item?.id}>
                        <td className="py-3 text-center">{item?.cantidad}</td>
                        <td className="py-3 text-center">{item?.productoId}</td>
                        <td className="py-3 text-center">{item?.precioUnitario}</td>
                        <td className="py-3 text-center">{item?.iva}</td>
                        <td className="py-3 text-center">{item?.subtotal}</td>
                    </tr>
                ))}
            </Table>

            <p className='text-end'>
                <b>
                    Total:{data?.factura?.total}<br />
                    Saldo: {data?.factura?.saldo}<br />
                </b>
            </p>
            <div className="d-flex justify-content-center align-items-center float-end mt-4 gap-3">
                <Btn onClick={() => closeModal} type="secondary">Cerrar</Btn>
                {guardar && <Btn type="secondary" onClick={() => guardar} outline>Guardar Factura</Btn>}
                <Btn type="primary">Cobrar Factura</Btn>
            </div>
        </div>
    </ModalBase>

}