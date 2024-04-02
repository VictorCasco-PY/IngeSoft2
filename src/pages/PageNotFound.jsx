import React from 'react'
import { useNavigate } from "react-router-dom";
import BotonCrear from '../components/bottons/ButtonCrear';

const PageNotFound = () => {

  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/clientes");
  }

  return (
    <div className="d-flex">
      <div className='mx-auto d-flex flex-column align-items-center justify-content-center gap-4'>
        <img src="images/404.png" alt="404" width={200} />
        <h1>La página solicitada no fué encontrada.</h1>
        
        <BotonCrear text="Volver al inicio" onClick={goToHome} />
      </div>
    </div>
  )
}

export default PageNotFound