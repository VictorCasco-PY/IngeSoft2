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

export const invertDateString = (date) => {
    //año-mes-dia a dia-mes-año
    const dateArray = date.split("-");
    return dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0];
}

//gracias ai
//date 1 si es igual o mayor a date 2
//año-mes-dia
export const dateIsLaterOrEqualThan = (date1, date2) => {
    const date1Array = date1.split("-");
    const date2Array = date2.split("-");
    if (parseInt(date1Array[0]) > parseInt(date2Array[0])) {
        return true;
    } else if (parseInt(date1Array[0]) === parseInt(date2Array[0])) {
        if (parseInt(date1Array[1]) > parseInt(date2Array[1])) {
            return true;
        } else if (parseInt(date1Array[1]) === parseInt(date2Array[1])) {
            if (parseInt(date1Array[2]) >= parseInt(date2Array[2])) {
                return true;
            }
        }
    }
    return false;
}