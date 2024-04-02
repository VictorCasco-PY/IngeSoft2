import React from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';

const FlechaAtras = ({ ruta = "/clientes" }) => {
    return (
        <Link to={ruta}>
            <IoArrowBackSharp className="text-black h3" />
        </Link>
    );
}

export default FlechaAtras;