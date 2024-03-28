class UserStorage {
    static setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static getEmpleadoId() {
        const user = this.getUser();
        return user ? user.empleadoId : null;
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
        localStorage.removeItem('user');
    }
}

export default UserStorage;