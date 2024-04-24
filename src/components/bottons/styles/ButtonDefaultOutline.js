import { ButtonDefault } from "./ButtonDefault";

export const ButtonDefaultOutline = {
  ...ButtonDefault,
  borderColor: "#6941C6",

  "&:hover": {
    ...ButtonDefault["&:hover"],
    borderColor: "#6941C6",
  },
};
