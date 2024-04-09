import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InfoClients from "./pages/clients/InfoClients";
import PageNotFound from "./pages/PageNotFound";
import Layout from "./components/layout/Layout";
import MainClients from "./pages/clients/mainClients";
import MainUsers from "./pages/users/mainUsers";
import Login from "./pages/Login";
import MainProductos from "./pages/productos/MainProductos";
import Servicios from "./pages/servicios/MainServicios";
import InfoServicios from "./pages/servicios/InfoServicios";
import MainProveedores from "./pages/proveedores/MainProveedores";
import MainMiUsuario from "./pages/mi_usuario/mainMiUsuario";
import MainCaja from "./pages/caja/MainCaja";
import AdministrarCaja from "./pages/caja/administrarCaja/AdministrarCaja";
import { CobrosPendientesVista } from "./pages/caja/cobrosPendientes/cobrosPendientesVista";
import RoleTestPage from "./pages/test/RoleTestPage";
import CurrentUserProvider from "./context/UserContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import RoleExclusivePage from "./pages/test/RoleExclusivePage";
import TablaActividadesCliente from "./components/tablas/TablaActividadesCliente";
import MainLista from "./pages/caja/ventas/lista/MainLista";
import MainVenta from "./pages/caja/ventas/factura/MainVenta";
import InfoCajas from "./pages/caja/listaCajas/InfoCajas";
import ComprasCaja from "./pages/caja/comprasProveedores/ComprasCaja";
import ListaCompras from "./pages/caja/comprasProveedores/ListaCompras";
import { ComprasCajaProvider } from "./context/ComprasCajaState";
import MainArqueo from "./pages/arqueo/MainArqueo";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CurrentUserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/clientes"
            element={
              <Layout>
                <MainClients />
              </Layout>
            }
          />
          <Route
            path="/users"
            element={
              <Layout>
                <MainUsers />
              </Layout>
            }
          />
          <Route
            path="/clientesinfo/:id"
            element={
              <Layout>
                <InfoClients />
              </Layout>
            }
          />
          <Route
            path="/productos"
            element={
              <Layout>
                <MainProductos />
              </Layout>
            }
          />
          <Route
            path="/servicios"
            element={
              <Layout>
                <Servicios />
              </Layout>
            }
          />
          <Route
            path="/infoServicio/:id"
            element={
              <Layout>
                <InfoServicios />
              </Layout>
            }
          />
          <Route
            path="/proveedores"
            element={
              <Layout>
                <MainProveedores />
              </Layout>
            }
          />

          {/*seccion de caja, agregar sus flujos de compra, venta, etc.*/}
          <Route
            path="/caja"
            element={
              <Layout>
                <MainCaja />
              </Layout>
            }
          />
          <Route exact element={<ProtectedRoute roles={["ADMIN", "CAJERO"]} />}>
            <Route
              exact
              path="/caja"
              element={
                <Layout>
                  <MainCaja />
                </Layout>
              }
            />
          </Route>
          <Route
            path="/caja"
            element={
              <Layout>
                <MainCaja />
              </Layout>
            }
          />
          <Route exact element={<ProtectedRoute roles={["ADMIN"]} />}>
            <Route
              exact
              path="/caja/lista"
              element={
                <Layout>
                  <InfoCajas />
                </Layout>
              }
            />
          </Route>
          <Route
            path="/caja/pendientes"
            element={
              <Layout>
                <CobrosPendientesVista />
              </Layout>
            }
          />
          <Route
            path="/caja/lista-ventas"
            element={
              <Layout>
                <MainLista />
              </Layout>
            }
          />
          <Route
            path="/caja/ventas"
            element={
              <Layout>
                <MainVenta />
              </Layout>
            }
          />
          <Route
            path="/caja/compras"
            element={
              <Layout>
                <ComprasCaja />
              </Layout>
            }
          />
          <Route
            path="/caja/lista-compras"
            element={
              <Layout>
                <ComprasCajaProvider>
                  <ListaCompras />
                </ComprasCajaProvider>
              </Layout>
            }
          />

          {/*seccion de roles, user context*/}
          <Route
            path="/role-tutorial"
            element={
              <Layout>
                <RoleTestPage />
              </Layout>
            }
          />
          {/*Asi por el momento es como se protege una ruta, roles es un array de strings de lo roles que pueden acceder*/}
          <Route
            exact
            element={
              <ProtectedRoute
                roles={["ADMIN", "CLIENTE", "ENTRENADOR", "CAJERO"]}
              />
            }
          >
            <Route
              exact
              path="/role-todos"
              element={
                <Layout>
                  <RoleExclusivePage mensaje="Todos los roles pueden ingresar a esta página" />
                </Layout>
              }
            />
          </Route>
          <Route exact element={<ProtectedRoute roles={["ADMIN"]} />}>
            <Route
              exact
              path="/role-admin"
              element={
                <Layout>
                  <RoleExclusivePage mensaje="Solo el admin puede ingresar a esta página" />
                </Layout>
              }
            />
          </Route>
          <Route exact element={<ProtectedRoute roles={["CLIENTE"]} />}>
            <Route
              exact
              path="/role-cliente"
              element={
                <Layout>
                  <RoleExclusivePage mensaje="Solo el cliente puede ingresar a esta página" />
                </Layout>
              }
            />
          </Route>
          <Route exact element={<ProtectedRoute roles={["ENTRENADOR"]} />}>
            <Route
              exact
              path="/role-entrenador"
              element={
                <Layout>
                  <RoleExclusivePage mensaje="Solo el entrenador puede ingresar a esta página" />
                </Layout>
              }
            />
          </Route>
          <Route exact element={<ProtectedRoute roles={["CAJERO"]} />}>
            <Route
              exact
              path="/role-cajero"
              element={
                <Layout>
                  <RoleExclusivePage mensaje="Solo el cajero puede ingresar a esta página" />
                </Layout>
              }
            />
          </Route>
          <Route
            path="/miUsuario"
            element={
              <Layout>
                <MainMiUsuario />
              </Layout>
            }
          />
          {/*FIN, BORRAR LUEGO DE DEMO*/}

          <Route
            path="/arqueo"
            element={
              <Layout>
                <MainArqueo />
              </Layout>
            }
          />

          <Route
            path="*"
            element={
              <Layout>
                <PageNotFound />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </CurrentUserProvider>
  </React.StrictMode>
);
