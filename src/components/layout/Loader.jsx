import CircularProgress from "@mui/material/CircularProgress";

export const Loader = ({ msg }) => (
  <div className="loading">
    <div className=" d-flex justify-content-center"><CircularProgress /></div> <br />
    <center>{msg ?? "Cargando..."}</center>
  </div>
);
