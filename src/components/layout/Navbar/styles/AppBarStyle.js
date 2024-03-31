export const AppBarStyle = {
  backgroundColor: "#fff",
  zIndex: "1000",
  boxShadow: "none",
  padding: "0 0",

  "& .nav-container": {
    width: "99vw",
    margin: "0 auto",

    // en pantallas grandes
    "@media (min-width: 1200px)": {
      width: "90vw",
      margin: "0 auto",
    },
  },

  "& #nav-logo": {
    width: "6rem",
    "& img": {
      width: "6rem",
    },
    "@media (max-width: 991px)": {
      display: "none"
    }
  },


};
