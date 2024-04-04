import React from 'react';
import CartaPrincipal from '../../components/cartaPrincipal/CartaPrincipal';

import './MainDashboard.css'
import TablaDashboard from '../../components/dashboard/TablaDashboard';
import LineChartDashboard from '../../components/dashboard/LineChartDashboard';
import PieChartDashboard from '../../components/dashboard/PieChartDashboard';
import { Btn } from '../../components/bottons/Button';
import ListIcon from '@mui/icons-material/List';

const pieData =
    [
        {
            "id": "Pagados",
            "label": "En Regla",
            "value": 400,
            "color": "hsl(48, 70%, 50%)"
        },
        {
            "id": "Pendientes",
            "label": "Morosos",
            "value": 112,
            "color": "hsl(273, 70%, 50%)"
        }
    ]

const data = [
    {
        "producto": "Bebida Energetica",
        "hot dog": 75,
        "hot dogColor": "hsl(22, 70%, 50%)",
    },
    {
        "producto": "Agua",
        "hot dog": 50,
        "hot dogColor": "hsl(60, 70%, 50%)",
    },
    {
        "producto": "Barra Proteinas",
        "hot dog": 29,
        "hot dogColor": "hsl(200, 70%, 50%)",
    }
];

const MainDashboard = () => (
    <CartaPrincipal hasCard={false}>
        <h1>Dashboard</h1>
        <h2>Septiembre 2024</h2>
        <div className='d-flex justify-content-between flex-row'>
            <div className='d-flex flex-column gap-4'>
                <div className='seccionDash'>
                    <p>Porcentaje de Clientes en Mora</p>
                    <div style={{ height: '350px', width: '550px' }}>
                        <PieChartDashboard data={pieData} />
                    </div>
                </div>

                <div className='seccionDash'>
                    <p>Productos mas Vendidos</p>
                    <TablaDashboard data={data} />
                </div>
            </div>

            <div className='seccionDash'>
                <p>Ingresos en este mes</p>
                <div style={{ height: '350px', width: '600px' }}>
                    <LineChartDashboard data={data} />
                </div>
                <Btn type="primary" className='mt-3 align-self-start' icon={<ListIcon />}
                    onClick={() => { navigate("/caja/lista") }}>
                    Ver Cajas
                </Btn>
                <Btn type="primary" className='mt-3 align-self-start' icon={<ListIcon />}
                    onClick={() => { navigate("/caja/lista") }}>
                    Ver Ingresos
                </Btn>
            </div>

        </div>
    </CartaPrincipal>
);

export default MainDashboard;