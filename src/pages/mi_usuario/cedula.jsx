import React from 'react';

// Función para dar formato al número de cédula
function formatearCedula(cedula) {
    // Primero eliminamos cualquier caracter que no sea un dígito
    let cedulaLimpiada = cedula.replace(/\D/g, '');

    // Luego aplicamos el formato deseado
    let parte1 = cedulaLimpiada.substring(0, 1); // Obtener el primer dígito
    let parte2 = cedulaLimpiada.substring(1, 4); // Obtener los siguientes 3 dígitos
    let parte3 = cedulaLimpiada.substring(4); // Obtener el resto de los dígitos
    
    // Devolver la cédula formateada
    return `${parte1}.${parte2}.${parte3}`;
}

// Componente que muestra el número de cédula con formato
function Cedula({ cedula }) {
    // Dar formato al número de cédula
    let cedulaFormateada = formatearCedula(cedula);

    return (
        <div>
            <p className="text-center" style={{ fontSize: "20px" }}>{cedulaFormateada}</p>
        </div>
    );
}

export default Cedula;

