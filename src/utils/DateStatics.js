const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const formatDate = (date) => {
    const fecha = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' : '') + date.getDate(); //todo: la fecha ya se formatea en el back, no importa formatear exactamente
    return fecha
}

export const getCurrentDate = () => {
    const today = new Date();
    return formatDate(today);
}

export const getMonthName = (monthIndex) => {
    return MESES[monthIndex];
}

export const getCurrentMonthName = () => {
    const fechaActual = new Date();
    const mesIndex = fechaActual.getMonth();
    return MESES[mesIndex];
}

export const getCurrentYear = () => {
    const fechaActual = new Date();
    return fechaActual.getFullYear();
}