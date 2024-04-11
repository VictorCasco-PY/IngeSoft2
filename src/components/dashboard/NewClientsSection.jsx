import React from 'react';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import NewClientsENUM from '../../utils/NuevosClientesENUM';

const NewClientsSection = ({ displayENUM, nuevosActual, nuevosAnterior }) => {

    const getArrowClassName = (displayEnum, position) => {
        console.log(displayEnum, position)
        if ((displayEnum === NewClientsENUM.NUEVOS && position === 1) || (displayEnum === NewClientsENUM.PERDIDOS && position === 2)) {
            return 'aGreen';
        } else if ((displayEnum === NewClientsENUM.NUEVOS && position === 2) || (displayEnum === NewClientsENUM.PERDIDOS && position === 1)) {
            return 'aRed';
        } else {
            return 'aYellow';
        }
    };

    const firstArrowClassName = getArrowClassName(displayENUM, 1);
    const secondArrowClassName = getArrowClassName(displayENUM, 2);

    return (
        <div className='d-flex flex-column gap-3'>
            <div className='d-flex gap-3'>
                {displayENUM === NewClientsENUM.NUEVOS && (<ArrowCircleUpIcon className={`arrowIndicator ${firstArrowClassName}`} />)}
                {displayENUM === NewClientsENUM.PERDIDOS && (<ArrowCircleDownIcon className={`arrowIndicator ${firstArrowClassName}`} />)}
                {displayENUM === NewClientsENUM.RETENIDOS && (<RemoveCircleOutlineIcon className={`arrowIndicator ${firstArrowClassName}`} />)}
                <nav style={{ fontSize: '2rem' }} className='notSelect'>{nuevosActual}</nav>
            </div>
            <h3 className='m-0 p-0'>Mes pasado:</h3>
            <div className='d-flex gap-3'>
                {displayENUM === NewClientsENUM.NUEVOS && (<ArrowCircleDownIcon className={`arrowIndicator ${secondArrowClassName}`} />)}
                {displayENUM === NewClientsENUM.PERDIDOS && (<ArrowCircleUpIcon className={`arrowIndicator ${secondArrowClassName}`} />)}
                {displayENUM === NewClientsENUM.RETENIDOS && (<RemoveCircleOutlineIcon className={`arrowIndicator ${secondArrowClassName}`} />)}
                <nav style={{ fontSize: '2rem' }} className='notSelect'>{nuevosAnterior}</nav>
            </div>
        </div>
    );
}

export default NewClientsSection;
