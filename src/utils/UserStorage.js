const USER_LABEL = 'user';

class UserStorage {
    static setUser(user) {
        localStorage.setItem(USER_LABEL, JSON.stringify(user));
    }

    static getUser() {
        const user = localStorage.getItem(USER_LABEL);
        return user ? JSON.parse(user) : null;
    }

    static getEmpleadoId() {
        const user = this.getUser();
        return user ? user.usuarioId : null;
    }

    static getUserRol() {
        const user = this.getUser();
        return user ? user.rol : null;
    }

    static getUserNombre() {
        const user = this.getUser();
        return user ? user.nombre : null;
    }

    static removeUser() {
        localStorage.removeItem(USER_LABEL);
    }
}

export default UserStorage;