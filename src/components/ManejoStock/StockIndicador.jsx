import React from "react";

const StockIndicator = ({ stock, cantidadLimite }) => {
  let displayStock;
  let color;
  let textColor;

  // Determina el color del indicador de stock según la cantidad
  if (stock === 0) {
    displayStock = "Sin Stock";
    color = "#FFDBD9"; // Rojo si no hay stock
    textColor = "#D92D20";
  } else {
    displayStock = stock;
    if (stock < cantidadLimite) {
      color = "#F0E0A8"; // Amarillo si hay menos de 11 productos
      textColor = "#7A6C02";
    } else {
      color = "#06d57f"; // Verde si hay más de 10 productos
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
        width: "70%",
        textAlign: "center",
        marginLeft: "1rem"
      }}
    >
      {displayStock}
    </div>
  );
};

export default StockIndicator;
