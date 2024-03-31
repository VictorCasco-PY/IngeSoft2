import React from "react";
import { createRoot } from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InfoClients from "./pages/clients/InfoClients";
import PageNotFound from "./pages/PageNotFound";
import Layout from "./components/layout/Layout";
import MainClients from "./pages/clients/mainClients";
import MainUsers from "./pages/users/mainUsers";
import Login from "./pages/Login";
import MainProductos from './pages/productos/MainProductos';
import Servicios from './pages/servicios/MainServicios';
import InfoServicios from "./pages/servicios/InfoServicios";
import MainProveedores from './pages/proveedores/MainProveedores';
import MainCaja from './pages/caja/MainCaja';
import AdministrarCaja from "./pages/caja/administrarCaja/AdministrarCaja";
import { CobrosPendientesVista } from "./pages/caja/cobrosPendientes/cobrosPendientesVista";
import RoleTestPage from "./pages/test/RoleTestPage";
import CurrentUserProvider from "./context/UserContext";
import ProtectedRoute from "./utils/ProtectedRoute";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CurrentUserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/clientes" element={<Layout><MainClients /></Layout>} />
          <Route path="/users" element={<Layout><MainUsers /></Layout>} />
          <Route path="/clientesinfo/:id" element={<Layout><InfoClients /></Layout>} />
          <Route path="/productos" element={<Layout><MainProductos /></Layout>} />
          <Route path="/servicios" element={<Layout><Servicios /></Layout>} />
          <Route path="/infoServicio/:id" element={<Layout><InfoServicios /></Layout>} />
          <Route path="/proveedores" element={<Layout><MainProveedores /></Layout>} />

          {/*seccion de caja, agregar sus flujos de compra, venta, etc.*/}
          <Route path="/caja" element={<Layout><MainCaja /></Layout>} />
          <Route path="/caja-administracion" element={<Layout><AdministrarCaja /></Layout>} />
          <Route path="/caja/pendientes" element={<Layout><CobrosPendientesVista /></Layout>} />


          <Route path="/role-tutorial" element={<Layout><RoleTestPage /></Layout>} />
          <ProtectedRoute path="/role-test" element={<Layout><RoleTestPage /></Layout>} roles={["ADMIN"]} />
          
          <Route path="*" element={<Layout><PageNotFound /></Layout>} />
        </Routes>
      </Router>
    </CurrentUserProvider>
  </React.StrictMode>
);