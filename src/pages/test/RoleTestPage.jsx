import React from 'react';
import CartaPrincipal from '../../components/cartaPrincipal/CartaPrincipal';
import { useCurrentUser } from '../../context/UserContext';
import RolEnum from '../../utils/RolEnum'

const RoleTestPage = () => {

    const { rol } = useCurrentUser();

    return (
        <CartaPrincipal>
            {/*demostracion de roles*/}
            <div>
                <h1>El rol actual es: {rol}</h1>
            </div>

            {rol === "ADMIN" && <h3>Este es un mensaje para el rol de administrador</h3>}
            {rol === "CLIENTE" && <h3>Este es un mensaje para el rol de cliente</h3>}
            {rol === "CAJERO" && <h3>Este es un mensaje para el rol de cajero</h3>}
            {rol === "ENTRENADOR" && <h3>Este es un mensaje para el rol de entrenador</h3>}
        </CartaPrincipal>
    );
}

export default RoleTestPage;