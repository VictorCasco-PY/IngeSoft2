import React from 'react'
import "./CartaPrincipal.css";

const CartaPrincipal = ({ children, isCentered = true }) => {
  return (
    <>
      <div className='carta rounded-3  shadow-lg'>
          {children}
      </div>
    </>
  )
}

export default CartaPrincipal