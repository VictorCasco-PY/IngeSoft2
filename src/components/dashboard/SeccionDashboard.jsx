import React from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const SeccionDashboard = ({ maximizedExists, setMaximizedExists, header, maximizable = false, id, children }) => {

    const handleMaximize = (id) => {
        const seccion = document.getElementById(id)
        //si el componente tiene un atributo maximized = true, se quita
        if (seccion.classList.contains("maximizedSeccion")) {
            seccion.classList.remove("maximizedSeccion")
            seccion.classList.add("seccionDashHover")
            setMaximizedExists(false)
            return
        }
        if (maximizedExists) return; //si ya hay un componente maximizado, no se puede maximizar otro
        setMaximizedExists(true)
        seccion.classList.remove("seccionDashHover")
        seccion.style.width = "566px" //borrar esto si se encuentra una mejor solucion, esto tiene animacion horrible
        seccion.classList.add("maximizedSeccion");
    }

    return (
        <div> {/*este div ayuda a maximizar*/}
            <div className='seccionDash seccionDashHover rounded-3' id={id}>
                {(!header && !maximizable) ?
                    (<></>)
                    :
                    (<div className='d-flex gap-1 align-items-center'>
                        {maximizable && <nav onClick={() => { handleMaximize(id) }} className='iconBoton d-flex align-items-center'><OpenInNewIcon /></nav>}
                        {header && <h3>{header}</h3>}
                    </div>)
                }
                {children}
            </div>
        </div>
    );
}

export default SeccionDashboard;