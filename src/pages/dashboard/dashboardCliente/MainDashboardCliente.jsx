import React, { useEffect, useState } from "react";
import DashCarta from "../../../components/dashboard/DashCarta";
import SeccionDashboard from "../../../components/dashboard/SeccionDashboard";
import "./MainDashboadCliente.css"; 
import MedicionesChart from "../../../components/dashboard/MedicionesChart";
import ProgresoChart from "../../../components/dashboard/ProgresoChart";
import UserStorage from "../../../utils/UserStorage";
import TablaSuscripciones from "../../../components/dashboard/TablaSuscripciones";
const MainDashboardCliente = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = UserStorage.getUserNombre();
    setUserId(id);
  }, []);

  //9876543

  return (
    <>
      <DashCarta>
        <div className="mb-2" style={{ display: "flex", width: "80%" }}>
          <h1>{userId}</h1>
        </div>

        <div className="MGrid position-relative">
          <div className="left-section">
            <SeccionDashboard id="seccion-progreso">
              <ProgresoChart />
            </SeccionDashboard>
            <SeccionDashboard id="seccion-mediciones" header="Mediciones ">
              <MedicionesChart></MedicionesChart>
            </SeccionDashboard>
          </div>
          <div className="right-section">
            <SeccionDashboard id="seccion-planes" header="Suscripciones ">
              <TablaSuscripciones />
            </SeccionDashboard>
          </div>
        </div>
      </DashCarta>
    </>
  );
};

export default MainDashboardCliente;
