CAJAID_LABEL = 'cajaId'
SESIONCAJAID_LABEL = 'sesionCajaId'

class CajaStorage {
    static setCajaId(id) {
        localStorage.setItem(CAJAID_LABEL, id);
    }
    static setSesionCajaId(id) {
        localStorage.setItem(SESIONCAJAID_LABEL, id);
    }

    static getSesionCajaId() {
        return localStorage.getItem(SESIONCAJAID_LABEL);
    }
    static getCajaId() {
        return localStorage.getItem(CAJAID_LABEL);
    }

    static removeCajaId() {
        localStorage.removeItem(CAJAID_LABEL);
    }
    static removeSesionCajaId() {
        localStorage.removeItem(SESIONCAJAID_LABEL);
    }

    static abrirCaja(data) {
        this.setCajaId(data['idCaja']);
        this.setSesionCajaId(data['id']);
    }

    static cerrarCaja() {
        this.removeCajaId()
        this.removeSesionCajaId()
    }
}

export default CajaStorage;