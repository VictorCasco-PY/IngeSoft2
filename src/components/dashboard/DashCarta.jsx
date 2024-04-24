import React from 'react'
import "./dashboardComps.css";

const DashCarta = ({ children }) => {
  return (
    <>
      <div className={'noCarta'}>
          {children}
      </div>
    </>
  )
}

export default DashCarta