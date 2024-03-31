import { HiArrowSmLeft } from "react-icons/hi";
import { Link } from "react-router-dom";

export const VolverAtras = ({ href }) => (
  <Link to={href}>
    <HiArrowSmLeft />
  </Link>
);
