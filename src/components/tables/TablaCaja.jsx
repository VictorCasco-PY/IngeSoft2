
const TablaCaja = ({ items }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Modalidad de Pago</th>
          <th scope="col">RUC</th>
          <th scope="col">Razón Social</th>
          <th scope="col">Dirección</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Producto</th>
          <th scope="col">P. Unitario</th>
          <th scope="col">IVA</th>
          <th scope="col">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item.fecha.toLocaleDateString()}</td>
            <td>{item.modalidadPago}</td>
            <td>{item.ruc}</td>
            <td>{item.razonSocial}</td>
            <td>{item.direccion}</td>
            <td>{item.cantidad}</td>
            <td>{item.producto}</td>
            <td>{item.precioUnitario}</td>
            <td>{item.iva}</td>
            <td>{item.subtotal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaCaja;