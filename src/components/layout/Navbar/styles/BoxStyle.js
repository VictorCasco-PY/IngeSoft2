
export const BoxStyle = {
    zIndex:"100",

    "@media (max-width: 991px)": {
        width: "15rem",
        boxShadow: "0 10px 25px -4px #888",        
        borderRadius: "0.4rem",
    },

    "@media (max-width: 500px)": {
        width: "50vw",
        height: "100vh",
        boxShadow: "0 10px 25px -4px #888",        
        borderRadius: "0.4rem",
    },

    "&  .a": {
        textAlign: "left",
    }

}