import { ButtonBase } from "./ButtonBase";

export const ButtonDefault = {
  ...ButtonBase,
  color: "#6941C6",

  "&:hover": {
    backgroundColor: "white",
    boxShadow: "0 0 0px 5px #EDDEFF",
    borderColor: `#EDDEFF`,
  },
};
