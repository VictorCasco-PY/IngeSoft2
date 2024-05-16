import React, { useEffect, useState } from "react";
import SeccionDashboard from "../../../components/dashboard/SeccionDashboard";
import UserStorage from "../../../utils/UserStorage";
import DashCarta from "../../../components/dashboard/DashCarta";
import ProgramasClientesChart from "../../../components/dashboard/ProgramasClientesChart";

const MainDashboardEntrenador = () => {
  const [userId, setUserId] = useState(null);
  const [nombre, setNombre] = useState(null);

  useEffect(() => {
    const id = UserStorage.getEmpleadoId();
    const nombre = UserStorage.getUserNombre();
    setUserId(id);
    setNombre(nombre);
  }, []);

  return (
    <>
      <DashCarta>
        <div className="mb-2" style={{ display: "flex", width: "80%" }}>
          <h1><strong>Entrenador:</strong> {nombre}</h1>
        </div>

        <div style={{ width: '50%', height: '80%'}}> 
          <SeccionDashboard
            id="seccion-programas"
          >
            <ProgramasClientesChart entrenadorId={userId} />
          </SeccionDashboard>
        </div>
      </DashCarta>
    </>
  );
};

export default MainDashboardEntrenador;
