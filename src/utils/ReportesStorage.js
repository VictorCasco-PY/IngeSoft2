const LAST_REFRESH = 'rep_last_refresh';
const EXPIRATION_DATE = 'rep_expiration_date';

const NEW_CLIENTS_LABEL = 'rep_new_clients';
const PRODUCTOS_MAS_VENDIDOS_LABEL = 'rep_productos_mas_vendidos';
const FECHA_PRODUCTOS_MAS_VENDIDOS_LABEL = 'rep_productos_fecha';
const CANTIDAD_MOROSOS = 'rep_cantidad_morosos';
const CLIENTES_ACTIVIDAD_LABEL = 'rep_clientes_actividad';
const CANTIDAD_PRODUCTOS_SIN_STOCK = 'rep_cantidad_productos_sin_stock';

class ReporteStorage {

    static setLastRefresh(date) {
        localStorage.setItem(LAST_REFRESH, date);
        return date;
    }

    static getLastRefresh() {
        return localStorage.getItem(LAST_REFRESH);
    }

    static setExpirationDate(date) {
        localStorage.setItem(EXPIRATION_DATE, date);
        return date;
    }

    static getExpirationDate() {
        return localStorage.getItem(EXPIRATION_DATE);
    }

    /// Nuevos Clientes start
    static setNewClientsData(data) {
        if (!data) {
            return null;
        }
        //formato
        // ls_new_clients = {nuevosToday: {dato}, nuevosLastMonth: {dato}} 

        //el unico dato que importa es cantidadNuevosClientes
        //crear un objeto {nuevosToday: cantidadNuevosClientes, nuevosLastMonth: cantidadNuevosClientes}
        let dataStringified = {
            nuevosToday: data['nuevosToday']['cantidadNuevosClientes'],
            nuevosLastMonth: data['nuevosLastMonth']['cantidadNuevosClientes']
        }
        //transformar a string
        dataStringified = JSON.stringify(dataStringified);
        localStorage.setItem(NEW_CLIENTS_LABEL, dataStringified);
        return data;
    }

    static getNewClientsData() {
        const data = localStorage.getItem(NEW_CLIENTS_LABEL);
        return data ? JSON.parse(data) : null;
    }
    /// Nuevos Clientes end

    /// Mas Vendidos start
    static setProductosMasVendidosData(data) {
        if (!data) {
            return null;
        }
        //formato
        // ls_productos_mas_vendidos = {productos: [{producto1}, {producto2}]} 

        //el unico dato que importa es cantidadNuevosClientes
        //crear un objeto [{nombreProducto: cantidad}, {nombreProducto: cantidad}]
        let dataStringified = [];
        data.forEach(producto => {
            dataStringified.push({
                nombreProducto: producto['nombreProducto'],
                cantidadVendida: producto['cantidadVendida']
            })
        })
        //transformar a string
        dataStringified = JSON.stringify(dataStringified);
        localStorage.setItem(PRODUCTOS_MAS_VENDIDOS_LABEL, dataStringified);
        return data;
    }


    static getProductosMasVendidosData() {
        const data = localStorage.getItem(PRODUCTOS_MAS_VENDIDOS_LABEL);
        return data ? JSON.parse(data) : null;
    }

    static setFechaProductosMasVendidosData(fecha) {
        if (!fecha) {
            return null;
        }
        //formato
        // ls_productos_fecha = {fechaInicio: fecha, fechaFin: fecha} 

        //transformar a string
        let dataStringified = JSON.stringify(fecha);
        localStorage.setItem(FECHA_PRODUCTOS_MAS_VENDIDOS_LABEL, dataStringified);
        return fecha;
    }

    static getFechaProductosMasVendidosData() {
        const data = localStorage.getItem(FECHA_PRODUCTOS_MAS_VENDIDOS_LABEL);
        return data ? JSON.parse(data) : null;
    }
    /// Mas Vendidos end


    ///Morosos start
    static setEstadosClientesData(data) {
        if (!data) {
            return null;
        }
        //formato
        // ls_cantidad_morosos = {cantidadClientesEnRegla: cantidad , cantidadClientesMorosos: cantidad} 

        //transformar a string
        let savedData = {
            cantidadClientesEnRegla: data.cantidadClientesEnRegla,
            cantidadClientesMorosos: data.cantidadClientesMorosos
        }
        const dataStringified = JSON.stringify(savedData);
        localStorage.setItem(CANTIDAD_MOROSOS, dataStringified);
        return savedData;
    }

    static getEstadosClientesData() {
        const data = localStorage.getItem(CANTIDAD_MOROSOS);
        return data ? JSON.parse(data) : null;
    }
    ///Morosos end


}

export default ReporteStorage;