import LabelBase from "../labels/LabelBase";
import ButtonBasic from "../bottons/ButtonBasic";
import useClienteData from "../../hooks/useClientesData";

const FormularioCliente = ({ cliente, onInputChange, onAceptar }) => {
  return (
    <form className="mb-3">
      <div className="mb-2 block">
        <LabelBase label="Nombre y Apellido:" htmlFor="nombre" />
        <input
          type="text"
          id="nombre"
          name="nombre"
          className="form-control"
          value={cliente.nombre}
          onChange={onInputChange}
        />
      </div>
      <div className="mb-2 block">
        <LabelBase label="Plan Actual:" htmlFor="plan-actual" />
        <select id="plan-actual" name="plan-actual" className="form-select">
          <option value="mensual">Mensual</option>
          <option value="semanal">Semanal</option>
          
        </select>
      </div>
      <div className="mb-2 block">
        <LabelBase label="RUC:" htmlFor="ruc" />
        <input
          type="text"
          id="ruc"
          name="ruc"
          className="form-control"
          value={cliente.ruc}
          onChange={onInputChange}
        />
      </div>
      <div className="mb-2 block">
        <LabelBase label="Telefono:" htmlFor="telefono" />
        <input
          type="tel"
          id="telefono"
          name="telefono"
          className="form-control"
          value={cliente.telefono}
          onChange={onInputChange}
        />
      </div>
      <div className="d-flex justify-content-center align-items-center float-end">
        <ButtonBasic text="Aceptar" onClick={onAceptar} />
      </div>
    </form>
  );
};

export default FormularioCliente;
