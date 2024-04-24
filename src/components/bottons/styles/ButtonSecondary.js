import { ButtonBase } from "./ButtonBase";

export const ButtonSecondary = {
  ...ButtonBase,
  borderColor: `transparent`,
  backgroundColor: "white",
  textTransform: "none",
  color: "#9c27b0",

  "&:hover": {
    backgroundColor: "white",
    boxShadow: "0 0 0px 5px #E7E1F5",
    borderColor: `#E7E1F5`,
  },

  "&>span.MuiCircularProgress-root": {
    ...ButtonBase["&>span.MuiCircularProgress-root"],
    color: "#9c27b0",
  },
};
