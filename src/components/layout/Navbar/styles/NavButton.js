import { NavButtonBase } from "./NavButtonBase";

export const NavButton = {
  ...NavButtonBase,
  color: "gray",
  border: "none",
  padding: "2em 1.5em",
  borderRadius: "0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  alignContent: "center",
  "&.selected": {
    color: "#7749F8",
    boxShadow: "0 5px 0 -1px #7749F8",
  },

  "&:hover": {
    ...NavButtonBase["&:hover"],
    boxShadow: "0 5px 0 -1px #7749F8",
  },
  
  "@media (max-width: 991px)": {
    // padding: "1.5em 0",

    "&.selected": {
      boxShadow: "0 0 0 0",
      backgroundColor: "#f4ebff",
      // poner texto en middle
    },

    "&:hover": {
      boxShadow: "0 0 0 0",
      backgroundColor: "#f4ebff",
      // poner texto en middle
    },

  }

};
