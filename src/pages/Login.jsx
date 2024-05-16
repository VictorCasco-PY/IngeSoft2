import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import Logo from "../assets/logo.png";
import { IoPeopleSharp } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/api";
import "../style.css";
import { useCurrentUser } from "../context/UserContext";
import useClientesData from "../hooks/useClientesData";

const Login = () => {
  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
  });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { login: contextLogin, userId } = useCurrentUser();
  const { olvidarContrasenha } = useClientesData();

  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      navigate("/clientes");
    }
  }, [userId]);

  const handleChange = (event) => {
    setUsuario({
      ...usuario,
      [event.target.name]: event.target.value,
    });
  };

  //voy a cambiar esta funcion para utilizar un hook de useAuth en el sig sprint, asi si el token expiró, se redirige a login automaticamente
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    api
      .post("/auth/login", usuario)
      .then((response) => {
        //cambio de andy: guardar el usuario en el contexto
        contextLogin(response.data);
        navigate("/clientes");
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 400) {
          toast.error("Datos incorrectos. Por favor, inténtalo de nuevo.");
        } else if (error.response && error.response.status === 404) {
          toast.error("Usuario no encontrado. Por favor, revisa tus datos.");
        } else {
          toast.error("Ha ocurrido un error. Inténtalo de nuevo.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleMostrarPassword = () => {
    setMostrarPassword(!mostrarPassword);
  };

  const handleEmailFocus = () => {
    setEmailFocused(true);
  };

  const handleEmailBlur = () => {
    if (!usuario.email) {
      setEmailFocused(false);
    }
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    if (!usuario.password) {
      setPasswordFocused(false);
    }
  };

  if (userId) {
    return <></>;
  }

  const handleMostrarModal = () => {
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  const handleSubmitRecuperarContraseña = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Llama a la función olvidarContrasenha con el correo del usuario
      await olvidarContrasenha({ email: usuario.email });

      console.log(usuario.email);
      toast.success("Correo de recuperación enviado correctamente.");
      setMostrarModal(false);
      //navigate("/recuperar-contrasenha/"); // Aquí agregamos el token a la URL
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
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
      <div className="login-card">
        <center>
          <img src={Logo} alt="Logo de la aplicación" className="logo" />
        </center>
        <form onSubmit={handleSubmit} id="login-form">
          <div
            className={`form-email ${
              emailFocused || usuario.email ? "focused" : ""
            }`}
          >
            <div className="input-container">
              <input
                id="login-email"
                name="email"
                value={usuario.email}
                className="form-input"
                type="text"
                placeholder="Usuario"
                onChange={handleChange}
                onFocus={handleEmailFocus}
                onBlur={handleEmailBlur}
                autoFocus
                required
              />
              <IoPeopleSharp className="input-icon" />
            </div>
          </div>
          <div
            className={`form-password ${
              passwordFocused || usuario.password ? "focused" : ""
            }`}
          >
            <div className="input-container">
              <input
                id="login-password"
                name="password"
                value={usuario.password}
                className="form-input"
                type={mostrarPassword ? "text" : "password"}
                placeholder="Contraseña"
                onChange={handleChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                required
              />
              <RiLockPasswordFill className="input-icon" />
            </div>
          </div>
          <div className="form-checkbox">
            <label>
              <input
                id="login-checkbox"
                type="checkbox"
                onChange={toggleMostrarPassword}
                checked={mostrarPassword}
              />{" "}
              Mostrar contraseña
            </label>
            <div className="forgot-password">
              <a
                type="button"
                className="forgot-password-link"
                onClick={handleMostrarModal}
              >
                ¿Has olvidado tu contraseña?
              </a>
            </div>
          </div>
          <div className="form-buttom">
            <button
              id="login"
              type="submit"
              className="login-button"
              disabled={loading}
              style={{ position: "relative" }}
            >
              {loading ? (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <ThreeDots
                    visible={true}
                    height="30"
                    width="30"
                    color="white"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Modal de recuperación de contraseña */}
      {mostrarModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-square">
            <div className="modal-content">
              <div className="modal-header">
                <span className="close" onClick={handleCerrarModal}>
                  &times;
                </span>
                <h2>Recuperar Contraseña</h2>
                <form onSubmit={handleSubmitRecuperarContraseña}>
                  <div className="form-email">
                    <div className="input-container">
                      <input
                        id="recuperar-email"
                        name="email"
                        value={usuario.email}
                        className="form-input"
                        type="email"
                        placeholder="Correo Electronico"
                        onChange={handleChange}
                        required
                      />
                      <IoPeopleSharp className="input-icon" />
                    </div>
                  </div>
                  <div className="form-buttom">
                    <button
                      type="submit"
                      className="login-button"
                      disabled={loading}
                      style={{ position: "relative" }}
                    >
                      {loading ? (
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <ThreeDots
                            visible={true}
                            height="30"
                            width="30"
                            color="white"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                          />
                        </div>
                      ) : (
                        "Enviar Correo de Recuperación"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
