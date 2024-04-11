const NEW_CLIENTS_LABEL = 'ls_new_clients';
const SESIONCAJAID_LABEL = 'sesionCajaId'

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
}

export default ReporteStorage;