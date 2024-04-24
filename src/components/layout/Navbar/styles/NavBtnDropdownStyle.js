import { NavButtonBase } from "./NavButtonBase";

export const NavBtnDropdownStyle = {
  ...NavButtonBase,
  border: "none",
  margin:"0 0",
  width: "100%",
  borderRadius: "0",

  "&:hover": {
    ...NavButtonBase["&:hover"],
    background: "#f4ebff",
  },

  "&.selected": {
    background: "#f4ebff",
    color: "#7749F8",
  },
 
};
