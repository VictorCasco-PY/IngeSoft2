import CircularProgress from "@mui/material/CircularProgress";

export const Loader = () => (
  <div className="loading">
    <CircularProgress /> <br />
    <div>Cargando...</div>
  </div>
);
