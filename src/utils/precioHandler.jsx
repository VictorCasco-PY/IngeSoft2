export const precioHandler = (precio) => {
  // Verificar si el precio es definido
  if (typeof precio !== 'undefined') {
    let result = precio.toString();

    // Dividir la cadena en grupos de 3 desde la derecha
    let grupos = [];
    while (result.length > 3) {
      grupos.unshift(result.slice(-3));
      result = result.slice(0, -3);
    }

    grupos.unshift(result); // Agregar el primer grupo

    // Unir los grupos con puntos y devolver el resultado
    return `${grupos.join(".")} Gs.`;
  } else {
    // Devolver un valor predeterminado o vacío si el precio es undefined
    return 'Precio no disponible';
  }
};
