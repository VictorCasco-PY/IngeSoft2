import React from 'react'
import "./CartaPrincipal.css";

const CartaPrincipal = ({ children, isCentered = true, hasCard = true }) => {
  return (
    <>
      <div className={hasCard ? 'carta rounded-3' : 'noCarta'}>
          {children}
      </div>
    </>
  )
}

export default CartaPrincipal