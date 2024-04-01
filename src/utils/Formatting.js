export const capFirstMinRest = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const formatFecha = (fecha) => {
    //from anho-mes-dia to dia-mes-anho
    const fechaSplit = fecha.split("-");
    return `${fechaSplit[2]}-${fechaSplit[1]}-${fechaSplit[0]}`;
}
