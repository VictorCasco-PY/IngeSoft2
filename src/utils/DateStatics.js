
export const formatDate = (date) => {
    const fecha = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' : '') + date.getDate(); //todo: la fecha ya se formatea en el back, no importa formatear exactamente
    return fecha
}

export const getCurrentDate = () => {
    const today = new Date();
    return formatDate(today);
}

