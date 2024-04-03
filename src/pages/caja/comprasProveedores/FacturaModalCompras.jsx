import { useEffect, useState } from "react";
import ModalBase from "../../../components/modals/ModalBase";
import { Table } from "../../../components/table/Table";
import { Btn } from "../../../components/bottons/Button";
import { iva } from "../../../utils/ivaHandler";
import { precioHandler } from "../../../utils/precioHandler";

export const FacturaModalCompras = ({ open, closeModal, data, guardar }) => {
  return (
    <ModalBase title={`Factura `} open={open} closeModal={closeModal}>
      <div>
        <p className="py-2">
          <b>Fecha de emision:</b> {data?.factura?.fecha}
          <br />
          <b>RUC Proveedor:</b> {data?.factura?.rucProveedor}
          <br />
          <b>Proveedor:</b> {data?.factura?.nombreProveedor}
          <br />
          <b>Direccion:</b> {data?.factura?.direccion}
          <br />
        </p>

        <Table
          headers={["Cantidad", "Producto", "Precio", "Iva", "Subtotal"]}
          textcenter
        >
          {data?.detalles?.map((item, index) => (
            <tr key={index}>
              <td className="py-3 text-center">{item?.cantidad}</td>
              <td className="py-3 text-center">{item?.producto}</td>
              <td className="py-3 text-center">
                {precioHandler(item?.precioUnitario)}
              </td>
              <td className="py-3 text-center">{iva(item?.iva)}</td>
              <td className="py-3 text-center">
                {precioHandler(item?.subtotal)}
              </td>
            </tr>
          ))}
        </Table>

        <p className="text-end">
          <b>
            Total: {precioHandler(data?.factura?.total)}
            <br />
          </b>
        </p>

        <div className="d-flex justify-content-center align-items-center float-end mt-4 gap-3">
          <Btn onClick={closeModal} type="secondary">
            Cerrar
          </Btn>
          {guardar && <Btn type="primary">Cobrar Factura</Btn>}
        </div>
      </div>
    </ModalBase>
  );
};
