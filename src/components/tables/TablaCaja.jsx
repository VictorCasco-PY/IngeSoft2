const TablaCaja = ({ items }) => {
  
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">N° Factura</th>
          <th scope="col">Fecha</th>
          <th scope="col">Proveedor</th>
          <th scope="col">RUC</th>
          <th scope="col">Estado</th>
          <th scope="col">Total(Gs)</th>
        </tr>
      </thead>
      <tbody>
        {/* Mapea sobre las facturas y muestra cada una en una fila de la tabla */}
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item.factura.nroFactura}</td>
            <td>{item.factura.fecha}</td>
            <td>{item.factura.nombreProveedor}</td>
            <td>{item.factura.rucProveedor}</td>
            <td>Pagado</td>
            <td>{item.factura.subTotal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaCaja;
