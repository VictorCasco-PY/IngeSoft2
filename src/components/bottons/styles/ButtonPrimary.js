import { ButtonBase } from "./ButtonBase";

export const ButtonPrimary = {
  ...ButtonBase,
  borderColor: `transparent`,
  backgroundColor: "#6941C6",
  boxShadow: "0 0 0px 0px #DFE3EC",
  textTransform: "none",
  color: "white",

  "&:hover": {
    backgroundColor: "#6941C6",
    boxShadow: "0 0 0px 5px #EDDEFF",
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
