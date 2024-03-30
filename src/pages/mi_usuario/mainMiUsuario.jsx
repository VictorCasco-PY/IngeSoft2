import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form"
import BotonCrear from "../../components/bottons/ButtonCrear";
import CartaPrincipal from "../../components/cartaPrincipal/CartaPrincipal";
import './mainMiUsuario.css'
import FlechaAtras from "../../components/flechaAtras/FlechaAtras";

const MainMiUsuario = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);

    return (
        <>
            <CartaPrincipal>
                 
            </CartaPrincipal>
        </>
    )
}


export default MainMiUsuario