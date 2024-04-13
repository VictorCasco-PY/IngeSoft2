import React, { useEffect, useState } from 'react';
import './MainDashboard.css'
import TablaDashboard from '../../components/dashboard/TablaDashboard'; //may be used
import LineChartDashboard from '../../components/dashboard/LineChartDashboard';
import PieChartDashboard from '../../components/dashboard/PieChartDashboard';
import { Btn } from '../../components/bottons/Button';
import ListIcon from '@mui/icons-material/List';
import BarChartIcon from '@mui/icons-material/BarChart';
import LineIngresoChartDashboard from '../../components/dashboard/LineIngresoChartDashboard';
import SeccionDashboard from '../../components/dashboard/SeccionDashboard';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DashCarta from '../../components/dashboard/DashCarta';
import NewClientsSection from '../../components/dashboard/NewClientsSection';
import { useDashboard } from '../../context/DashboardContext';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getCurrentMonthName, getCurrentYear, invertDateString } from '../../utils/DateStatics';
import ReporteStorage from '../../utils/ReportesStorage';
import InfoIcon from '@mui/icons-material/Info';

//estos son los datos de prueba para este ticket, se deben borrar en la implementacion
//todos estos datos seran guardados localmente en el componente, no se necesitara hacer llamadas a la api
const lineDataOne = [
    {
        "id": "Ingresos",
        "color": "rgb(44, 160, 44)",
        "data": [
            {
                "x": "Enero",
                "y": 138
            },
            {
                "x": "Febrero",
                "y": 132
            },
            {
                "x": "Marzo",
                "y": 207
            },
        ]
    },
    {
        "id": "Egresos",
        "color": "rgb(214, 39, 40)",
        "data": [
            {
                "x": "Enero",
                "y": 119
            },
            {
                "x": "Febrero",
                "y": 120
            },
            {
                "x": "Marzo",
                "y": 233
            },
        ]
    }
]

const lineDataTwo = [
    {
        "id": "Ingresos",
        "color": "rgb(44, 160, 44)",
        "data": [
            {
                "x": "Enero",
                "y": 138
            },
            {
                "x": "Febrero",
                "y": 120
            },
            {
                "x": "Marzo",
                "y": 300
            },
            {
                "x": "Abril",
                "y": 289
            },
            {
                "x": "Mayo",
                "y": 289
            },
        ]
    },
    {
        "id": "Egresos",
        "color": "rgb(214, 39, 40)",
        "data": [
            {
                "x": "Enero",
                "y": 119
            },
            {
                "x": "Febrero",
                "y": 120
            },
            {
                "x": "Marzo",
                "y": 233
            },
            {
                "x": "Abril",
                "y": 300
            },
            {
                "x": "Mayo",
                "y": 189
            },
        ]
    }
]

const MainDashboard = () => {
    const [currentMaximized, setCurrentMaximized] = useState(null) //referencia al elemento maximizado

    const [ingresosDisplayingData, setIngresosDisplayingData] = useState(lineDataOne) //borrar despues
    //Estos estados son solo para test, se deben borrar en la implementacion
    const [filterTestBoolIngresos, setFilterTestBoolIngresos] = useState(false)

    const [lastRefresh, setLastRefresh] = useState('')
    const { refreshData, checkExpirationTime, isLoadingNewClients } = useDashboard();

    //Borrar luego de implementacion
    const filterIngresos = () => {
        if (filterTestBoolIngresos) {
            setIngresosDisplayingData(lineDataOne)
            setFilterTestBoolIngresos(false)
        } else {
            setIngresosDisplayingData(lineDataTwo)
            setFilterTestBoolIngresos(true)
        }
    }

    const handleBlurClick = () => {
        //TODO: esta solucion es fea por el momento, si currentMaximized es del tipo html elemento (que en realidad es un objeto)
        if (!currentMaximized) return;
        if (typeof (currentMaximized) === "object" && currentMaximized.classList.contains("maximizedSeccion")) {
            currentMaximized.classList.remove("maximizedSeccion")
            currentMaximized.classList.add("seccionDashHover")
            setCurrentMaximized(null)
        }
    }

    const refreshDashboard = () => {
        refreshData();
        setLastRefresh(ReporteStorage.getLastRefresh())
    }

    useEffect(() => {
        //si los datos expiraron refrescar
        if (checkExpirationTime()) { 
            refreshData(true);
        }
        setLastRefresh(ReporteStorage.getLastRefresh())
    }, [])

    return (
        <>
            {lastRefresh && (
                <div className='m-0 lastRefreshAbsolute d-flex align-items-center gap-1'>
                    <b className='d-flex align-items-center'><InfoIcon /> Ultima actualización: </b>
                    <p className='m-0 p-0'> {invertDateString(lastRefresh)}</p>
                </div>
            )}

            <div id="blur-screen-dashboard" className={currentMaximized ? 'blurScreen actBlur' : 'blurScreen'} onClick={handleBlurClick}></div>
            <DashCarta>
                <div className='DashboardHeader mb-2'>
                    <h1>Dashboard</h1>
                    <h2>{getCurrentMonthName() + ' ' + getCurrentYear()}</h2>
                    <div>
                        <Btn type="primary" onClick={refreshDashboard} icon={<RefreshIcon />} disabled={isLoadingNewClients} loading={isLoadingNewClients}>Actualizar</Btn>
                    </div>
                </div>
                <div className='MDGrid position-relative'>

                    <SeccionDashboard id="seccion-clientes" header="Porcentaje de Clientes en Mora" maximizable={true} maximizedElement={currentMaximized} setMaximizedElement={setCurrentMaximized}>
                        <PieChartDashboard />
                    </SeccionDashboard>

                    <div className='d-flex flex-column gap-4'>
                        <SeccionDashboard header="Nuevos clientes este mes:">
                            <NewClientsSection />
                        </SeccionDashboard>
                        <SeccionDashboard header="Enlaces">
                            <div>
                                <Btn id="btn-ver-cajas" type="primary" className='mt-3 align-self-start' icon={<ListIcon />} onClick={() => { alert("En progreso") }}>
                                    Ver Cajas
                                </Btn>
                                <Btn id="btn-ver-movimientos" type="primary" className='mt-3 align-self-start' icon={<BarChartIcon />} onClick={() => { alert("En progreso") }}>
                                    Ver Movimientos
                                </Btn>
                            </div>
                        </SeccionDashboard>
                    </div>

                    <SeccionDashboard id="seccion-actividades" header="Actividades mas Suscritas" maximizable={true} maximizedElement={currentMaximized} setMaximizedElement={setCurrentMaximized}>
                        <LineChartDashboard />
                    </SeccionDashboard>

                    <SeccionDashboard id="seccion-productos" header="Productos mas Vendidos" maximizable={true} maximizedElement={currentMaximized} setMaximizedElement={setCurrentMaximized}>
                        <LineChartDashboard />
                    </SeccionDashboard>

                    <SeccionDashboard id="seccion-movimientos" header="Ingresos de Movimientos" maximizable={true} maximizedElement={currentMaximized} setMaximizedElement={setCurrentMaximized}>
                        <div className='align-self-end'>
                            <Btn type="primary" className='mt-3 align-self-start' icon={<FilterAltIcon />} onClick={() => { filterIngresos() }}>
                                Filtrar
                            </Btn>
                        </div>
                        {/*Este filtrado debe ser un un slider con los meses*/}
                        <div className='graphSection'>
                            <LineIngresoChartDashboard data={ingresosDisplayingData} />
                        </div>
                    </SeccionDashboard>

                </div>
            </DashCarta>
        </>
    )
}

export default MainDashboard;