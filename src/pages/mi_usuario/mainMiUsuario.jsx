import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";
import "./mainMiUsuario.css";
import toast, { Toaster } from "react-hot-toast";
import { IoPencilOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import ButtonBasic from "../../components/bottons/ButtonBasic.jsx";
import api from "../../utils/api";
import LabelBase from "../../components/labels/LabelBase";
import ModalBase from "../../components/modals/ModalBase";
import Telefono from "./telefono.jsx";
import Cedula from "./cedula.jsx";
import ButtonCrear from "../../components/bottons/ButtonCrear";
import { fetchUsers } from "../users/mainUsers.jsx";
import { Password } from "@mui/icons-material";

const MainMiUsuario = () => {
  const emptyUser = {
    nombre: "",
    cedula: "",
    telefono: "",
    direccion: "",
    email: "",
    rol: null,
  };

  const [passwords, setPasswords] = useState({
    passActual: '',
    nuevaPass: '',
    confirmarPass: '',
  });

  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredUsersState, setFilteredUsersState] = useState(filteredUsers);
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [userData, setUser] = useState(emptyUser);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [error, setError] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false); // Estado para controlar la visibilidad de los detalles
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user.email;
  const passwordRegex = /^(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+[\]{};':"\\|,.<>\/?]{6,}$/;

  const handlePassword = (event) => {
    const { name, value } = event.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const validatePassword = () => {
    const { passActual, nuevaPass, confirmarPass } = passwords;

    // No se puede comprobar la contraseña actual dentro de esta función de validación, eso debe hacerse en el backend

    if (passActual === nuevaPass) {
      toast.error("La nueva contraseña no puede ser igual a la contraseña actual");
      return false;
    }

    const passwordRegex = /^(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+[\]{};':"\\|,.<>\/?]{6,}$/;

    if (!passwordRegex.test(nuevaPass)) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres, al menos un carácter especial y al menos un número");
      return false;
    }

    if (nuevaPass !== confirmarPass) {
      toast.error("La nueva contraseña y la confirmación no coinciden");
      return false;
    }

    return true;
  };

  const handelAceptarPassword = async () => {
    if (!validatePassword()) {
      return;
    }

    try {
      const response = await api.post('/password/change', passwords);
      toast.success("Nueva contraseña guardada");
      setShowEditPasswordModal(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error al procesar la solicitud:", error);
        toast.error("Error al procesar la solicitud");
      }
    }
  };

  useEffect(() => {
    if (user.rol === 2) {
      fetchCliente();
    } else {
      fetchEmpleado();
    }
  }, []);

  const roles = [
    { label: "rol", value: null },
    { label: "admin", value: 1 },
    { label: "cajero", value: 3 },
    { label: "entrenador", value: 4 },
  ];

  const getRoleName = (id) => {
    if (id === 1) return "Administrador";
    if (id === 2) return "Cliente";
    if (id === 3) return "Cajero";
    if (id === 4) return "Entrenador";
  };

  const fetchEmpleado = async () => {
    const response = await api.get(`/empleados/getByEmail/${email}`);
    setUser(response.data);
  };

  const fetchCliente = async () => {
    const response = await api.get(`/clientes/getByEmail/${email}`);
    setUser(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Verificar si el campo es 'telefono' y si el valor contiene solo números
    if (name === "telefono" && !/^\d*$/.test(value)) {
      return;
    }

    if (name === "ruc") {
      let cedulaValue = "";
      if (value.length > 7) {
        cedulaValue = value.slice(0, 7); // los primeros 7 caracteres del RUC
      } else {
        cedulaValue = value; // Si el RUC tiene menos de 7 caracteres toma el valor completo
      }
      setUser({
        ...userData,
        [name]: value,
        cedula: cedulaValue,
      });
    } else {
      // Si no es 'ruc', actualiza normalmente
      setUser({
        ...userData,
        [name]: value,
      });
    }
  };

  const ButtonBasic2 = ({ initials }) => {
    const circleSize = 150; // Cambia el tamaño deseado
    const fontSize = 60; // Cambia el tamaño de la fuente deseado
    return (
      <svg width={circleSize} height={circleSize}>
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={circleSize / 2 - 5}
          fill="#F9F5FF"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.35em"
          fill="#7F56D9"
          fontSize={fontSize}
        >
          {initials}
        </text>
      </svg>
    );
  };

  const getInitials = (name) => {
    const words = name.split(" ");
    const initials = words.map((word) => word.charAt(0)).join("");
    return initials.toUpperCase();
  };

  const initials = userData ? getInitials(userData.nombre) : "";

  const handleAceptar = async () => {
    try {
      if (modalMode === "edit") {
        // Verificar si se realizaron cambios
        const editedUsuarios = users.some((user) => user.id === userData.id);
        if (
          editedUsuarios.nombre === userData.nombre &&
          editedUsuarios.cedula === userData.cedula
        ) {
          toast.promise(new Promise((resolve) => resolve()), {
            loading: "Guardando...",
            success: "No se realizo ningun cambio en el user.",
            error: "Hubo un error al guardar los cambios.",
          });
          return;
        }

        const response = await api.put(`/empleados/${userData.id}`, userData);
        console.log("Usuario editado:", response.data);
        toast.success("Usuario actualizado satisfactoriamente");
        setUser(response.data);
        setShowModal(false);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      console.log(error);
      toast.error("Error al procesar la solicitud");
    }
  };
  return (
    <>
      <CartaPrincipal>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            success: {
              style: {
                background: "#75B798",
                color: "#0A3622",
              },
            },
            error: {
              style: {
                background: "#FFDBD9",
                color: "#D92D20",
              },
            },
          }}
        />
        {userData && (
          <div>
            <div className="container prueba">
              <div className="row">
                <div className="col-3 text-end">
                  <ButtonBasic2 initials={initials} />
                </div>
                <div className="headerMi col-5 pt-2">
                  <h1 style={{ color: "#667085" }}>{userData.nombre}</h1>
                  <h3 style={{ color: "#667085" }}>
                    {getRoleName(userData.rol)}
                  </h3>
                </div>
              </div>
            </div>
            <div style={{ marginLeft: "10%" }}>
              <div className="d-flex justify-content-center mb-4 float-end editMi">
                {showModal && (
                  <ModalBase
                    title="Editar Mi Usuario"
                    open={showModal}
                    closeModal={() => setShowModal(false)}
                  >
                    <div className="mb-3">
                      <div className="label-container">
                        <LabelBase label="Nombre:" htmlFor="nombre" />
                        <span className="required">*</span>
                      </div>
                      <input
                        id="input-name"
                        style={{ width: "100%", height: "30px" }}
                        type="text"
                        name="nombre"
                        className="form-control"
                        value={userData.nombre}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="mb-2 block">
                        <div className="label-container">
                          <LabelBase label="Teléfono:" htmlFor="telefono" />
                          <span className="required">*</span>
                        </div>
                        <input
                          id="input-telefono"
                          style={{ width: "100%", height: "30px" }}
                          type="text"
                          name="telefono"
                          className="form-control"
                          value={userData.telefono}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="row">
                        <div className="col-sm">
                          <div className="label-container">
                            <LabelBase label="Ruc:" htmlFor="ruc" />
                            <span className="required">*</span>
                          </div>
                          <input
                            style={{ width: "100%", height: "30px" }}
                            type="text"
                            id="input-ruc"
                            name="ruc"
                            className="form-control"
                            value={userData.ruc}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-sm">
                          <div className="label-container">
                            <LabelBase label="Cedula:" htmlFor="cedula" />
                            <span className="required">*</span>
                          </div>
                          <input
                            style={{ width: "100%", height: "30px" }}
                            type="text"
                            id="input-cedula"
                            name="cedula"
                            className="form-control"
                            value={userData.cedula}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-2 block">
                          <div className="label-container">
                            <LabelBase
                              label="Direccion:"
                              htmlFor="direccion"
                            />
                            <span className="required">*</span>
                          </div>
                          <input
                            style={{ width: "100%", height: "30px" }}
                            type="text"
                            id="input-direccion"
                            name="direccion"
                            className="form-control"
                            value={userData.direccion}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-2 block">
                          <div className="label-container">
                            <LabelBase label="e-mail:" htmlFor="e-mail" />
                            <span className="required">*</span>
                          </div>
                          <input
                            type="text"
                            style={{ width: "100%", height: "30px" }}
                            id="input-direccion"
                            name="email"
                            className="form-control"
                            value={userData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="campo-obligatorio">
                          <span className="required">*</span>
                          <span className="message">Campo obligatorio</span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center float-end">
                      <ButtonBasic
                        id="btn-aceptar"
                        text="Aceptar"
                        onClick={handleAceptar}
                      />
                    </div>
                  </ModalBase>
                )}
              </div>
              <div className="d-flex justify-content-center mb-4 float-end editMi">
                {showEditPasswordModal && (
                  <ModalBase
                    title="Cambiar contraseña"
                    open={showEditPasswordModal}
                    closeModal={() => setShowEditPasswordModal(false)}
                  >
                    <div className="mb-3">
                      <div className="label-container">
                        <LabelBase
                          label="Ingrese su contraseña actual:"
                          htmlFor="actualPassword"
                        />
                        <span className="required">*</span>
                      </div>
                      <input
                        id="input-actualpassword"
                        style={{ width: "100%", height: "30px" }}
                        type="password"
                        name="passActual"
                        className="form-control"
                        onChange={handlePassword}
                        required
                      />
                      <div className="label-container">
                        <LabelBase
                          label="Ingrese su nueva contraseña:"
                          htmlFor="newPassword"
                        />
                        <span className="required">*</span>
                      </div>
                      <input
                        id="input-newpassword"
                        style={{ width: "100%", height: "30px" }}
                        type="password"
                        name="nuevaPass"
                        className="form-control"
                        onChange={handlePassword}
                        required
                      />
                      <div className="label-container">
                        <LabelBase
                          label="Repita su nueva contraseña:"
                          htmlFor="repPassword"
                        />
                        <span className="required">*</span>
                      </div>
                      <input
                        id="input-reppassword"
                        style={{ width: "100%", height: "30px" }}
                        type="password"
                        name="confirmarPass"
                        className="form-control"
                        onChange={handlePassword}
                        required
                      />
                      <div className="d-flex justify-content-center align-items-center float-end">
                        <ButtonBasic
                          id="btn-aceptar"
                          text="Aceptar"
                          onClick={handelAceptarPassword}
                        />
                      </div>
                    </div>
                  </ModalBase>
                )}
              </div>
            </div>
            <div className="contenedorDetalles">
              <hr className="liner" />
              <div className="row">
                <div className="col-2"></div>
                <div className="col-4 text-center">
                  <h4 style={{ fontSize: "30px", color: "#667085" }}>e-mail</h4>
                  <p style={{ fontSize: "20px" }}>{userData.email}</p>
                </div>
                <div className="col-4 text-center">
                  <h4 style={{ fontSize: "30px", color: "#667085" }}>Cédula</h4>
                  <Cedula cedula={userData.cedula} />
                </div>
                <div className="col-2"></div>
              </div>
              <hr className="linerSecundar" />
              <div className="row">
                <div className="col-2"></div>
                <div className="col-4 text-center">
                  <h4 style={{ fontSize: "30px", color: "#667085" }}>
                    Teléfono
                  </h4>
                  <Telefono telefono={userData.telefono} />
                </div>
                <div className="col-4 text-center">
                  <h4 style={{ fontSize: "30px", color: "#667085" }}>
                    Dirección
                  </h4>
                  <p style={{ fontSize: "20px" }}>{userData.direccion}</p>
                </div>
                <div className="col-2"></div>
              </div>
            </div>
            <hr className="liner" />
            <div className="contenedorBotones">
              <div className="col-3 prueba text-center">
                <ButtonBasic
                  color="primary"
                  text="Cambiar contraseña"
                  onClick={() => setShowEditPasswordModal(true)}
                />
              </div>
              <div className="col-3 prueba text-center">
                <ButtonCrear
                  id="btn-crear"
                  text="Editar mi informacion"
                  onClick={() => setShowModal(true)}
                  icon={<IoPencilOutline />}
                  color="secondary"
                />
              </div>
            </div>
          </div>
        )}
      </CartaPrincipal>
    </>
  );
};

export default MainMiUsuario;
