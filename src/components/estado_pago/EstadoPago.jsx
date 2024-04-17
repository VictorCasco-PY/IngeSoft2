import React from 'react';

const EstadoPago = ({ estado }) => {
  let color;
  let textColor;
  let estadoCapitalizado;

  if (estado) {
    estadoCapitalizado = estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase(); // Capitalizamos la primera letra y convertimos el resto a minúscula
  } else {
    estadoCapitalizado = "Sin plan";
  }

  switch (estado) {
    case 'pagado':
      color = "#ECFDF3"; 
      textColor = "#027A48"; // Color verde 
      break;
    case 'pendiente':
      color = '#FFDBD9';
      textColor = '#D92D20'; // Color rojo 
      break;
    default:
      color = '#FFDBD9'; 
      textColor = '#D92D20'; // Color rojo por defecto
  }

  return (
    <div 
      style={{
        backgroundColor: color,
        color: textColor,
        borderRadius: "5px",
        fontWeight: "bold",
        textAlign: "center",
        width: "75%",
        marginLeft: "auto",
        marginRight: "auto"
      }}>
      {estadoCapitalizado}
    </div>
  );
};

export default EstadoPago;
