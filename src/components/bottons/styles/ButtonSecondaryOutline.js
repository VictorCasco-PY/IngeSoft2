import { ButtonSecondary } from "./ButtonSecondary";

export const ButtonSecondaryOutline = {
  ...ButtonSecondary,
  borderColor: "#9c27b0",

  "&:hover": {
    ...ButtonSecondary["&:hover"],
    borderColor: "#9c27b0",
  },
};
