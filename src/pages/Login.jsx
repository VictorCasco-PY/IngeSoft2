import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import Logo from "../assets/logo.png";
import { IoPeopleSharp } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/api";
import "../style.css";
import { useCurrentUser } from "../context/UserContext";

const Login = () => {
  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
  });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login: contextLogin, userId } = useCurrentUser();

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
        if (response.data.rol == 2) {
          navigate("/clientes/actividades");
        } else {
          navigate("/clientes");
        }
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
                placeholder=" "
                onChange={handleChange}
                onFocus={handleEmailFocus}
                onBlur={handleEmailBlur}
                autoFocus
                required
              />
              <IoPeopleSharp className="input-icon" />
            </div>
            <label className="placehold">Usuario</label>
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
                placeholder=" "
                onChange={handleChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                required
              />
              <RiLockPasswordFill className="input-icon" />
            </div>
            <label className="placehold">Contraseña</label>
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
    </div>
  );
};

export default Login;
