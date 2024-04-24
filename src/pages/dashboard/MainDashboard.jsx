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
import { Toaster } from 'react-hot-toast';
import ActividadesChart from '../../components/dashboard/ActividadesChart';
import CBadge from '../../components/labels/CBadge';

const MainDashboard = () => {
    const [currentMaximized, setCurrentMaximized] = useState(null) //referencia al elemento maximizado

    const [lastRefresh, setLastRefresh] = useState('')
    const { refreshData, checkExpirationTime, isLoadingNewClients } = useDashboard();

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
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    success: {
                        style: {
                            background: "#75B798",
                            color: "#0A3622",
                        },
                    },
                    error: {
                        style: {
                            background: "#FFDBD9",
                            color: "#D92D20",
                        },
                    },
                }}
            />

            {lastRefresh && (
                <div className='lastRefreshAbsolute'>
                    <CBadge isStrongTitle={false} icon={<InfoIcon />} type="success" style={{ margin: 'auto' }} title="Ultima actualización:" >
                        {invertDateString(lastRefresh)}
                    </CBadge>
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

                        <SeccionDashboard id="seccion-movimientos" header="Ingresos de Movimientos" maximizable={true} maximizedElement={currentMaximized} setMaximizedElement={setCurrentMaximized}>
                            <LineIngresoChartDashboard />
                        </SeccionDashboard>
                    </div>

                    <SeccionDashboard id="seccion-productos" header="Productos mas Vendidos" maximizable={true} maximizedElement={currentMaximized} setMaximizedElement={setCurrentMaximized}>
                        <LineChartDashboard />
                    </SeccionDashboard>

                    <SeccionDashboard id="seccion-actividades" header="Actividades mas Suscritas" maximizable={true} maximizedElement={currentMaximized} setMaximizedElement={setCurrentMaximized}>
                        <ActividadesChart />
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
            </DashCarta>
        </>
    )
}

export default MainDashboard;