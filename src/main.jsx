import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
import { CobrosPendientesVista } from "./pages/caja/cobrosPendientes/cobrosPendientesVista";
import CurrentUserProvider from "./context/UserContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import MainLista from "./pages/caja/ventas/lista/MainLista";
import MainVenta from "./pages/caja/ventas/factura/MainVenta";
import InfoCajas from "./pages/caja/listaCajas/InfoCajas";
import ComprasCaja from "./pages/caja/comprasProveedores/ComprasCaja";
import ListaCompras from "./pages/caja/comprasProveedores/ListaCompras";
import { ComprasCajaProvider } from "./context/ComprasCajaState";
import InformacionClientes from "./pages/clients/InfoClientes/InformacionClientes";
import { InfoClientsProvider } from "./context/InfoClientesContext";
import MainDashboard from "./pages/dashboard/MainDashboard";
import RolEnum from "./utils/RolEnum";
import { MovimientosVista } from "./pages/caja/movimientos/MovimientosVista";
import DashboardProvider from "./context/DashboardContext";
import MainArqueo from "./pages/arqueo/MainArqueo";
import { ArqueoProvider } from "./context/ArqueoContext";
import ReporteCliente from "./pages/reportes/MainClientesReporte";
import MainArqueoLista from "./pages/arqueo/MainArqueoLista";
import PlanesVista from "./pages/planes-entrenamiento/planes-vista";
import EntrenamientoPrincipiante from "./pages/planes-entrenamiento/planeamiento/EntrenamientoPrincipiante";
import EntrenamientoIntermedio from "./pages/planes-entrenamiento/planeamiento/EntrenamientoIntermedio";
import EntrenamientoAvanzado from "./pages/planes-entrenamiento/planeamiento/EntrenamientoAvanzado";
import DetalleEntrenamiento from "./pages/planes-entrenamiento/planeamiento-ejercicios/DetalleEntrenamiento";
import AsignarPlanACliente from "./pages/planes-entrenamiento/cliente-planes/AsignarPlanACliente";
import MainAsignarPlanACliente from "./pages/planes-entrenamiento/cliente-planes/MainAsignarPlanACliente";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <CurrentUserProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/miUsuario"
            element={
              <Layout>
                <MainMiUsuario />
              </Layout>
            }
          />
          <Route
            path="/clientes"
            element={
              <Layout>
                <MainClients />
              </Layout>
            }
          />
          <Route exact element={<ProtectedRoute roles={[RolEnum.ADMIN]} />}>
            <Route
              exact
              path="/dashboard"
              element={
                <Layout>
                  <DashboardProvider>
                    <MainDashboard />
                  </DashboardProvider>
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
              path="/arqueo"
              element={
                <Layout>
                  <ArqueoProvider>
                    <MainArqueo />
                  </ArqueoProvider>
                </Layout>
              }
            />
            <Route
              path="/arqueo/lista"
              element={
                <Layout>
                  <MainArqueoLista />
                </Layout>
              }
            />
            <Route
              exact
              path="/caja/historial"
              element={
                <Layout>
                  <MovimientosVista />
                </Layout>
              }
            />
            <Route
              path="/planes-entrenamiento/asignar"
              element={
                <Layout>
                  <MainAsignarPlanACliente />
                </Layout>
              }
            />
          </Route>
          <Route
            exact
            element={<ProtectedRoute roles={[RolEnum.ADMIN, RolEnum.CAJERO]} />}
          >
            <Route
              exact
              path="/caja/lista"
              element={
                <Layout>
                  <InfoCajas />
                </Layout>
              }
            />
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
            <Route
              path="/clientes"
              element={
                <Layout>
                  <MainClients />
                </Layout>
              }
            />
            <Route
              path="/clientesinfo/:id"
              element={
                <Layout>
                  <InfoClientsProvider>
                    <InformacionClientes />
                  </InfoClientsProvider>
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
              path="/proveedores"
              element={
                <Layout>
                  <MainProveedores />
                </Layout>
              }
            />
            <Route
              exact
              path="/caja"
              element={
                <Layout>
                  <ArqueoProvider>
                    <MainCaja />
                  </ArqueoProvider>
                </Layout>
              }
            />
          </Route>
          <Route
            exact
            element={
              <ProtectedRoute roles={[RolEnum.ADMIN, RolEnum.ENTRENADOR]} />
            }
          >
            <Route
              path="/servicios"
              element={
                <Layout>
                  <Servicios />
                </Layout>
              }
            />
            <Route
              path="/clientesinfo/:id"
              element={
                <Layout>
                  <InfoClientsProvider>
                    <InformacionClientes />
                  </InfoClientsProvider>
                </Layout>
              }
            />
            <Route
              path="/clientes"
              element={
                <Layout>
                  <MainClients />
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
              path="/reportes"
              element={
                <Layout>
                  <ReporteCliente />
                </Layout>
              }
            />
          </Route>
          <Route
            path="planes-entrenamiento"
            element={
              <Layout>
                <PlanesVista />
              </Layout>
            }
          />
          <Route
            path="planes-entrenamiento/principiante"
            element={
              <Layout>
                <EntrenamientoPrincipiante />
              </Layout>
            }
          />
          <Route
            path="planes-entrenamiento/intermedio"
            element={
              <Layout>
                <EntrenamientoIntermedio />
              </Layout>
            }
          />
          <Route
            path="planes-entrenamiento/avanzado"
            element={
              <Layout>
                <EntrenamientoAvanzado />
              </Layout>
            }
          />
          <Route
            path="planes-entrenamiento/:slug"
            element={
              <Layout>
                <DetalleEntrenamiento />
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
      </CurrentUserProvider>
    </Router>
  </React.StrictMode>
);
