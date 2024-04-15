import React from 'react'
import "./CartaPrincipal.css";

const CartaPrincipal = ({ children }) => {
  return (
    <>
      <div className={'carta rounded-3'}>
          {children}
      </div>
    </>
  )
}

export default CartaPrincipal