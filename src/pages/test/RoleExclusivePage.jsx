import React from 'react';
import CartaPrincipal from '../../components/cartaPrincipal/CartaPrincipal';

const RoleExclusivePage = ({mensaje}) => {

    return (
        <CartaPrincipal>
            <div>
                <h1>{mensaje}</h1>
            </div>
        </CartaPrincipal>
    );
}

export default RoleExclusivePage;