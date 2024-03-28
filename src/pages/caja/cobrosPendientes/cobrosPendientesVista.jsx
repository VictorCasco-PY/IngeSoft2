import { useEffect, useState } from "react";
import { useFactura } from "../../../hooks/useFactura";
import { CobrosPendientesLista } from "./cobrosPendientesLista";

export const CobrosPendientesVista = () => {

    const [data, setData] = useState([]);

  const { isLoading, error, getFacturasPendientes } = useFactura();

  useEffect(() => {
    setData(getFacturasPendientes());
  }, []);

  const switchRender = () => {
    if (isLoading) {
      return <div>Cargando...</div>;
    }
    if (error) {
      return <div>Error</div>;
    }
    console.log(data)
    return ;
    // data.map((factura) => {
    //     return (
    //     <tr key={factura.id}>
    //         <td>{factura.id}</td>
    //         <td>{factura.fecha}</td>
    //         <td>{factura.cliente}</td>
    //         <td>{factura.ruc}</td>
    //         <td>{factura.estado}</td>
    //         <td>{factura.condicion}</td>
    //         <td>{factura.vendedor}</td>
    //         <td>{factura.total}</td>
    //         <td>{factura.utilidad}</td>
    //     </tr>
    //     );
    // });
  };

  return (
    <CobrosPendientesLista>
        {switchRender()}
    </CobrosPendientesLista>
  );
};
