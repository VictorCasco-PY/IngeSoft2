import { ButtonBase } from "./ButtonBase";
import '../../../global.css'

export const ButtonDanger = {
  ...ButtonBase,
  borderColor: `transparent`,
  backgroundColor: "rgb(217, 45, 32)",
  boxShadow: "0 0 0px 0px #DFE3EC",
  textTransform: "none",
  color: "white",

  "&:hover": {
    backgroundColor: "rgb(217, 45, 32)",
    boxShadow: "0 0 0px 5px rgb(255, 219, 217)",
    color: "white",
  },

  "&>span.MuiCircularProgress-root": {
    ...ButtonBase["&>span.MuiCircularProgress-root"],
    color: "white",
  },

  "&:disabled": {
    backgroundColor: "#888",
    color: "#ccc",
  },
};
