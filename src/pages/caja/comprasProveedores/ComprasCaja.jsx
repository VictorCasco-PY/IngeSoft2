import FormularioCaja from "../../../components/Formularios/FormularioCaja";
import FlechaAtras from "../../../components/flechaAtras/FlechaAtras";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal";


const ComprasCaja = () => {
  return (
    <>
      <CartaPrincipal>
        <div
          className="d-flex align-items-center"
          style={{ marginTop: "1.5rem" }}
        >
          <FlechaAtras ruta="/caja"/>
          <h2 style={{ marginLeft: "3rem" }}>Registrar Compra</h2>
        </div>
        <FormularioCaja />
      </CartaPrincipal>
    </>
  );
};

export default ComprasCaja;
