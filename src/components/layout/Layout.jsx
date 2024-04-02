import React from 'react'
import './Layout.css'
import { NewNavbar } from './Navbar/NewNavbar'

const Layout = ({ children }) => {
  return (
    <>
      <NewNavbar />
    {/* todas las pantallas estaran rodeadas de este fondo, gris al fondo
        - Para utilizar la carta blanca del medio, ver componente CartaPrincipal */}
      <div className='FondoApp pt-5'>
        {children}
      </div>
    </>
  )
}

export default Layout