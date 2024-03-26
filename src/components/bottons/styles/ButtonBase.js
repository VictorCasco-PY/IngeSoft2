export const ButtonBase = {
  border: `0.15rem solid transparent`,
  borderRadius: "0.8em", // Utilizando em para hacerlo relativo
  padding: "0.45em 1.5em", // Utilizando em para hacerlo relativo
  display: "inline-flex",
  textTransform: "none",
  fontWeight: "bold",
  textAlign: "center",
  margin: "0.2em",
  height: "2.8em",

  "&>span[role='progressbar']": {
    color: "#6941C6",
    width: "1.7em !important",
    height: "1.7em !important",
    marginRight: "0.5rem",
  },

  "& > span.icon": {
    position: "relative",
    marginRight: "0.5rem",
    verticalAlign: "middle",
    display: "flex",
    fontSize: "1.4rem",
  },

  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
    backgroundColor: "#ddd",
    color: "#444",
    borderColor: "#ddd",
  },

  "@media (max-width: 1100px)": {
    "&>span[role='progressbar']": {
      marginRight: "0rem",
    },

    "& > span.icon": {
      marginRight: "0rem",
    },
    "& > span.text": {
      display: "none",
    },
  },
};
