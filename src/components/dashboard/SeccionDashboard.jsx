import React from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const SeccionDashboard = ({ maximizedElement, setMaximizedElement, header, maximizable = false, id, children }) => {

    const handleMaximize = (id) => {
        const seccion = document.getElementById(id)
        //si el componente tiene un atributo maximized = true, se quita
        if (seccion.classList.contains("maximizedSeccion")) {
            minimize(seccion)
            return
        }
        if (maximizedElement) return; //esta variable es un puntero al elemento maximizado, si ya hay uno maximizado, no se puede maximizar otro
        maximize(seccion)
    }

    const minimize = (element) => {
        element.classList.remove("maximizedSeccion")
        element.classList.add("seccionDashHover")
        setMaximizedElement(null) //se limpia la variable
    }

    const maximize = (element) => {
        setMaximizedElement(element) //se guarda el elemento maximizado
        element.classList.remove("seccionDashHover")
        element.style.width = "566px" //borrar esto si se encuentra una mejor solucion, esto tiene animacion horrible
        element.classList.add("maximizedSeccion");
    }

    return (
        <div> {/*este div ayuda a maximizar*/}
            <div className='seccionDash seccionDashHover rounded-3' id={id}>
                {(!header && !maximizable) ?
                    (<></>)
                    :
                    (<div className='d-flex gap-1 align-items-center'>
                        {maximizable && <nav onClick={() => { handleMaximize(id) }} className='iconBoton d-flex align-items-center' id={`btn-maximizar-${id}`}><OpenInNewIcon /></nav>}
                        {header && <h3>{header}</h3>}
                    </div>)
                }
                {children}
            </div>
        </div>
    );
}

export default SeccionDashboard;