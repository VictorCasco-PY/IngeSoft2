import React from 'react';
import './labels.css'

const CBadge = ({ type, title, children, ...props }) => {

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
            <div className={`alertTitle ${titleClass}`}>
                <p className='m-0 p-0'>{title}</p>
            </div>
            <p className='m-0 p-0'>
                {children}
            </p>
        </div>
    );
};

export default CBadge;