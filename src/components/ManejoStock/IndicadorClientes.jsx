import React from "react";

const IndicatorClientes = ({ clientes }) => {
  let displayStock;
  let color;
  let textColor;

  // Determina el color del indicador de clientes según la cantidad
  if (clientes === 0) {
    displayStock = "Sin Clientes";
    color = "#FFDBD9"; // Rojo 
    textColor = "#D92D20";
  } else {
    displayStock = clientes;
    if (clientes < 11) {
      color = "#F0E0A8"; // Amarillo si hay menos de 11 clientes
      textColor = "#7A6C02";
    } else {
      color = "#06d57f"; // Verde si hay más de 10 clientes
      textColor = "#027A48";
    }
  }

  return (
    <div
    style={{
      backgroundColor: color,
      color: textColor,
      borderRadius: "5px",
      fontWeight: "bold",
      textAlign: "center",
      width: "45%",
      marginLeft: "auto",
      marginRight: "auto"
    }}
    
    >
      {displayStock}
    </div>
  );
};

export default IndicatorClientes;
