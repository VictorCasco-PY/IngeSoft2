const NEW_CLIENTS_LABEL = 'ls_new_clients';
const PRODUCTOS_MAS_VENDIDOS_LABEL = 'ls_productos_mas_vendidos';

class ReporteStorage {
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
                cantidad: producto['cantidad']
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
}

export default ReporteStorage;