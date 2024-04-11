import React, { useState, useEffect } from 'react';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import NewClientsENUM from '../../utils/NuevosClientesENUM';
import useReporteClientes from '../../hooks/useReporteClientes';
import CircularProgress from "@mui/material/CircularProgress";
import { useDashboard } from '../../context/DashboardContext';

const NewClientsSection = () => {
    //SECCION NUEVOS CLIENTES
    const [nuevosClientesNumber, setNuevosClientesNumber] = useState(0)
    const [nuevosClientesLastMonth, setNuevosClientesLastMonth] = useState(0)
    const [nuevosClientesDisplaying, setNuevosClientesDisplaying] = useState(NewClientsENUM.NUEVOS)
    const { isDataStored, nuevosClientesData, getReportesData, isLoading } = useDashboard();

    const ordenarDatos = async () => {
        if (isDataStored) {
            const presentClients = nuevosClientesData.nuevosToday
            const lastMonthClients = nuevosClientesData.nuevosLastMonth
            setNuevosClientesNumber(presentClients)
            setNuevosClientesLastMonth(lastMonthClients)
            //para el display de flechas de la seccion, se chequean 3 casos
            if (presentClients > lastMonthClients) { //mas nuevos este mes
                setNuevosClientesDisplaying(NewClientsENUM.NUEVOS)
            } else if (presentClients < lastMonthClients) { //menos nuevos este mes
                setNuevosClientesDisplaying(NewClientsENUM.PERDIDOS)
            } else { //iguales
                setNuevosClientesDisplaying(NewClientsENUM.RETENIDOS)
            }
        }
    }

    useEffect(() => {
        getReportesData()
        ordenarDatos()
        console.log(isLoading)
    }, [isLoading])

    const getArrowClassName = (nuevosClientesDisplaying, position) => {
        if ((nuevosClientesDisplaying === NewClientsENUM.NUEVOS && position === 1) || (nuevosClientesDisplaying === NewClientsENUM.PERDIDOS && position === 2)) {
            return 'aGreen';
        } else if ((nuevosClientesDisplaying === NewClientsENUM.NUEVOS && position === 2) || (nuevosClientesDisplaying === NewClientsENUM.PERDIDOS && position === 1)) {
            return 'aRed';
        } else {
            return 'aYellow';
        }
    };

    const firstArrowClassName = getArrowClassName(nuevosClientesDisplaying, 1);
    const secondArrowClassName = getArrowClassName(nuevosClientesDisplaying, 2);

    return (
        <div className='d-flex flex-column gap-3'>
            <div className='d-flex gap-3'>
                {nuevosClientesDisplaying === NewClientsENUM.NUEVOS && (<ArrowCircleUpIcon className={`arrowIndicator ${firstArrowClassName}`} />)}
                {nuevosClientesDisplaying === NewClientsENUM.PERDIDOS && (<ArrowCircleDownIcon className={`arrowIndicator ${firstArrowClassName}`} />)}
                {nuevosClientesDisplaying === NewClientsENUM.RETENIDOS && (<RemoveCircleOutlineIcon className={`arrowIndicator ${firstArrowClassName}`} />)}
                <nav style={{ fontSize: '2rem' }} className='notSelect'>{isLoading ? (<CircularProgress />) : (nuevosClientesNumber)}</nav>
            </div>
            <h3 className='m-0 p-0'>Mes pasado:</h3>
            <div className='d-flex gap-3'>
                {nuevosClientesDisplaying === NewClientsENUM.NUEVOS && (<ArrowCircleDownIcon className={`arrowIndicator ${secondArrowClassName}`} />)}
                {nuevosClientesDisplaying === NewClientsENUM.PERDIDOS && (<ArrowCircleUpIcon className={`arrowIndicator ${secondArrowClassName}`} />)}
                {nuevosClientesDisplaying === NewClientsENUM.RETENIDOS && (<RemoveCircleOutlineIcon className={`arrowIndicator ${secondArrowClassName}`} />)}
                <nav style={{ fontSize: '2rem' }} className='notSelect'>{isLoading ? (<CircularProgress />) : (nuevosClientesLastMonth)}</nav>
            </div>
        </div>
    );
}

export default NewClientsSection;
