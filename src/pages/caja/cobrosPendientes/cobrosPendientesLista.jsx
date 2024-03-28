import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";
import { Table } from "../../../components/table/Table";

export const CobrosPendientesLista = ({ children }) => {
  
    return (
    <CartaPrincipal>
        <Table headers={["Nº Factura", "Fecha", "Cliente", "RUC", "Estado", "Condición", "Vendido por", "Total", "Utilidad"]}>
            {children}
        </Table>
    </CartaPrincipal>)

};
