import React from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import useProgresos from "../../hooks/useProgresos";
import "bootstrap/dist/css/bootstrap.min.css";

const ProgresoChart = () => {
  const { progresos, loading } = useProgresos();
  const [showTable, setShowTable] = React.useState(false);

  const toggleTable = () => {
    setShowTable(!showTable);
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Progreso </h2>
      {progresos.map((progreso) => (
        <div className="row align-items-center mb-3" key={progreso.id}>
          <div
            className="col d-flex align-items-center justify-content-center"
            style={{ fontSize: "20px", alignItems: "center" }}
          >
            {progreso.programa}
          </div>
          <div className="col-9">
            <div
              className="progress"
              style={{
                height: "40px",
                backgroundColor: "white",
                border: "2px solid #6941C6",
                width: "100%",
              }}
            >
              <div
                className="progress-bar"
                style={{
                  width: `${progreso.porcentaje}%`,
                  backgroundColor: "#6941C6",
                  borderRadius: "0px",
                }}
                role="progressbar"
                aria-valuenow={progreso.porcentaje}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span style={{ color: "white" }}>
                  {Math.round(progreso.porcentaje)}%
                </span>
              </div>
            </div>
          </div>
          <div className="col-1">
            <span style={{ color: "black" }}>{progreso.porcentaje}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgresoChart;
