import React from 'react';

const SeccionDashboard = ({id, children }) => {
    return (
        <div className='seccionDash seccionDashHover' id={id}>
            {children}
        </div>
    );
}

export default SeccionDashboard;