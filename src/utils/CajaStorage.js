class CajaStorage {
    static setCajaId(id) {
        localStorage.setItem('cajaId', id);
    }
    static setSesionCajaId(id) {
        localStorage.setItem('sesionCajaId', id);
    }

    static getSesionCajaId() {
        return localStorage.getItem('sesionCajaId');
    }
    static getCajaId() {
        return localStorage.getItem('cajaId');
    }

    static removeCajaId() {
        localStorage.removeItem('cajaId');
    }
    static removeSesionCajaId() {
        localStorage.removeItem('sesionCajaId');
    }

    static cerrarCaja() {
        this.removeCajaId()
        this.removeSesionCajaId()
    }
}

export default CajaStorage;