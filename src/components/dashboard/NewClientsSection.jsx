import React, { useState, useEffect } from 'react';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RemoveIcon from '@mui/icons-material/Remove';
import NewClientsENUM from '../../utils/NuevosClientesENUM';
import CircularProgress from "@mui/material/CircularProgress";
import { useDashboard } from '../../context/DashboardContext';
import ReporteStorage from '../../utils/ReportesStorage';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const NewClientsSection = () => {
    //SECCION NUEVOS CLIENTES
    const [nuevosClientesNumber, setNuevosClientesNumber] = useState(0)
    const [nuevosClientesLastMonth, setNuevosClientesLastMonth] = useState(0)
    const [nuevosClientesDisplaying, setNuevosClientesDisplaying] = useState(NewClientsENUM.NUEVOS)
    const { getNewClients, isLoadingNewClients } = useDashboard();

    const [isNuevosEmpty, setIsNuevosEmpty] = useState(false)
    const [isLastMonthEmpty, setIsLastMonthEmpty] = useState(false)

    const ordenarDatos = async () => {
        setIsNuevosEmpty(false)
        setIsLastMonthEmpty(false)
        let data;
        if (!ReporteStorage.getNewClientsData()) {
            data = await getNewClients()
        } else {
            data = ReporteStorage.getNewClientsData();
        }

        const presentClients = data.nuevosToday
        const lastMonthClients = data.nuevosLastMonth
        setNuevosClientesNumber(presentClients)
        setNuevosClientesLastMonth(lastMonthClients)
        //para el display de flechas de la seccion, se chequean 3 casos
        if (presentClients > lastMonthClients) { //mas nuevos este mes
            setNuevosClientesDisplaying(NewClientsENUM.NUEVOS)
        } else if (presentClients < lastMonthClients) { //menos nuevos este mes
            setNuevosClientesDisplaying(NewClientsENUM.MENOS)
        } else { //iguales
            setNuevosClientesDisplaying(NewClientsENUM.RETENIDOS)
        }

        if (presentClients === 0) {
            setIsNuevosEmpty(true)
        }
        if (lastMonthClients === 0) {
            setIsLastMonthEmpty(true)
        }
    }

    useEffect(() => {
        ordenarDatos()
    }, [isLoadingNewClients])

    const getArrowClassName = (nuevosClientesDisplaying, position) => {
        if ((nuevosClientesDisplaying === NewClientsENUM.NUEVOS && position === 1) || (nuevosClientesDisplaying === NewClientsENUM.MENOS && position === 2)) {
            return 'aLightGreen';
        } else if ((nuevosClientesDisplaying === NewClientsENUM.NUEVOS && position === 2) || (nuevosClientesDisplaying === NewClientsENUM.MENOS && position === 1)) {
            return 'aGreen';
        } else { //fue otro estilo anteriormente
            return 'aGreen';
        }
    };

    const firstArrowClassName = getArrowClassName(nuevosClientesDisplaying, 1);
    const secondArrowClassName = getArrowClassName(nuevosClientesDisplaying, 2);

    return (
        <div className='d-flex flex-column gap-3'>
            <div className='d-flex gap-3'>
                {isNuevosEmpty ? (
                    <RemoveIcon className={`arrowIndicator aYellow`} />
                ) : (
                    <>
                        {nuevosClientesDisplaying === NewClientsENUM.NUEVOS && (
                            <KeyboardDoubleArrowUpIcon className={`arrowIndicator ${firstArrowClassName}`} />
                        )}
                        {nuevosClientesDisplaying === NewClientsENUM.MENOS && (
                            <KeyboardArrowUpIcon className={`arrowIndicator ${firstArrowClassName}`} />
                        )}
                        {nuevosClientesDisplaying === NewClientsENUM.RETENIDOS && (
                            <KeyboardArrowUpIcon className={`arrowIndicator ${firstArrowClassName}`} />
                        )}
                    </>
                )}
                <nav style={{ fontSize: '2rem' }} className='notSelect'>
                    {isLoadingNewClients ? (
                        <Skeleton style={{ width: '40px' }} />
                    ) : (
                        nuevosClientesNumber
                    )}
                </nav>
            </div>
            <h3 className='m-0 p-0'>Mes pasado:</h3>
            <div className='d-flex gap-3'>
                {isLastMonthEmpty ? (
                    <RemoveIcon className={`arrowIndicator aYellow`} />
                ) : (
                    <>
                        {nuevosClientesDisplaying === NewClientsENUM.NUEVOS && (
                            <KeyboardArrowUpIcon className={`arrowIndicator ${secondArrowClassName}`} />
                        )}
                        {nuevosClientesDisplaying === NewClientsENUM.MENOS && (
                            <KeyboardDoubleArrowUpIcon className={`arrowIndicator ${secondArrowClassName}`} />
                        )}
                        {nuevosClientesDisplaying === NewClientsENUM.RETENIDOS && (
                            <KeyboardArrowUpIcon className={`arrowIndicator ${secondArrowClassName}`} />
                        )}
                    </>
                )}
                <nav style={{ fontSize: '2rem' }} className='notSelect'>
                    {isLoadingNewClients ? (
                        <Skeleton style={{ width: '40px' }} />
                    ) : (
                        nuevosClientesLastMonth
                    )}
                </nav>
            </div>
        </div>

    );
}

export default NewClientsSection;
