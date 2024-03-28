import { Table } from "../../../components/table/Table";

export const cobrosPendientesLista = ({ children }) => {
  
    return <Table headers={["Nº Factura", "Fecha", "Cliente", "RUC", "Estado", "Condición", "Vendido por", "Total", "Utilidad"]}>
        {children}
    </Table>;

};
