import React from 'react'
import NavBar from './NavBar'
import './Layout.css'

const Layout = ({ children }) => {
  return (
    <>
      <NavBar />
    {/* todas las pantallas estaran rodeadas de este fondo, gris al fondo
        - Para utilizar la carta blanca del medio, ver componente CartaPrincipal */}
      <div className='FondoApp pt-5'>
        {children}
      </div>
    </>
  )
}

export default Layout