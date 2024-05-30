import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import api from "../../utils/api";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";
import BotonCrear from "../../components/bottons/ButtonCrear";
import FlechaAtras from "../../components/flechaAtras/FlechaAtras";
import "./recu.css";

const RecuperarContraseña = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams(); // Obtener el token de los parámetros de la URL

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error(
        "Las contraseñas no coinciden. Por favor, inténtalo de nuevo."
      );
      return;
    }

    setLoading(true);

    try {
      // Llama al endpoint para restablecer la contraseña con el token
      await api.post(`/password/reset/${token}`, { password });

      toast.success("Contraseña actualizada correctamente.");
      navigate("/#");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(
        `Error al restablecer la contraseña: ${error.response.data.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartaPrincipal>
      {console.log(token)}
      <div className="d-flex align-items-center gap-3">
        <FlechaAtras ruta="/#" />
        <h2>Nueva Contraseña</h2>
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          error: {
            style: {
              background: "#FFDBD9",
              color: "#D92D20",
            },
          },
        }}
      />
      <div className="cuadro">
        <form  id="recuperar-form">
          <div className="center-container2">
            <div className="form-password2">
              <div className="input-container2">
                <input
                  id="new-password"
                  name="password"
                  value={password}
                  className="form-input"
                  type="password"
                  placeholder="Nueva Contraseña"
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>
            <div className="form-password2">
              <div className="input-container2">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  value={confirmPassword}
                  className="form-input"
                  type="password"
                  placeholder="Confirmar Contraseña"
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>
            </div>
            <div className="form-bottom2">
              <BotonCrear onClick={handleSubmit} text={"Guardar Nueva Contraseña"} />
            </div>
          </div>
        </form>
      </div>
    </CartaPrincipal>
  );
};

export default RecuperarContraseña;
