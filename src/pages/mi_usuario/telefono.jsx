import React from 'react';

// Función para dar formato al número de teléfono
function formatearNumero(numero) {
    // Primero eliminamos cualquier caracter que no sea un dígito
    let numeroLimpiado = numero.replace(/\D/g, '');

    // Luego aplicamos el formato deseado
    let codigoPais = numeroLimpiado.substring(0, 3); // Obtener los primeros 3 dígitos
    let parte1 = numeroLimpiado.substring(3, 6); // Obtener los siguientes 3 dígitos
    let parte2 = numeroLimpiado.substring(6, 9); // Obtener los siguientes 3 dígitos
    let parte3 = numeroLimpiado.substring(9); // Obtener el resto de los dígitos
    
    // Devolver el número formateado
    return `+${codigoPais} ${parte1} ${parte2} ${parte3}`;
}

// Componente que muestra el número de teléfono con formato
function Telefono({ telefono }) {
    // Dar formato al número de teléfono
    let numeroFormateado = formatearNumero(telefono);

    return (
        <div>
            <p className="text-center" style={{ fontSize: "20px" }}>{numeroFormateado}</p>
        </div>
    );
}

export default Telefono;
