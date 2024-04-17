import React from 'react';
import './labels.css'

/*
    TYPE: 'danger' | 'success' | 'warning' , color de fondo
    TITLE: string, titulo del badge
    ICON: Elemento jsx icono a mostrar
    ISSTRONGTITLE: boolean, si el titulo es fuerte o no
    CHILDREN: string, contenido del badge
    
    ejemplo:
    <CBadge type='danger' title='Error' icon={<ErrorIcon />}>
        Error en la carga de datos
    </CBadge>
*/

const CBadge = ({ type, title, children, icon, isStrongTitle = true, ...props }) => {

    let bodyClass = '';
    let titleClass = '';
    if (type === 'danger') {
        bodyClass = 'bodyDanger';
        titleClass = 'titleDanger';
    } else if (type === 'success') {
        bodyClass = 'bodySuccess';
        titleClass = 'titleSuccess';
    } else if (type === 'warning') {
        bodyClass = 'bodyWarning';
        titleClass = 'titleWarning';
    }

    return (
        <div className={`alertBody ${bodyClass}`} {...props}>
            <div className={`alertTitle ${isStrongTitle ? titleClass : ''}`}>
                {icon && icon}
                <p className='m-0 p-0'>{title}</p>
            </div>
            <p className='m-0 p-0'>
                {children}
            </p>
        </div>
    );
};

export default CBadge;