import React from 'react'
import "./CartaPrincipal.css";
import CircularProgress from "@mui/material/CircularProgress";

const loading = () => (<div className="loading">
<CircularProgress /> <br/>
<div>Cargando...</div>
</div>)

const CartaPrincipal = ({ children, isCentered = true, isLoading }) => {
  return (
    <>
      <div className='carta rounded-3 shadow shadow-lg'>
          {isLoading ? loading() : children}
      </div>
    </>
  )
}

export default CartaPrincipal