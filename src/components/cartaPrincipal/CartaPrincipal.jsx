import React from 'react'
import "./CartaPrincipal.css";

const CartaPrincipal = ({ children, isCentered = true }) => {
  return (
    <>
      <div className='carta px-5 py-3'>
          {children}
      </div>
    </>
  )
}

export default CartaPrincipal