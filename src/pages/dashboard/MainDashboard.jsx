import React from 'react';
import CartaPrincipal from '../../components/cartaPrincipal/CartaPrincipal';

import './MainDashboard.css'
import TablaDashboard from '../../components/dashboard/TablaDashboard';
import LineChartDashboard from '../../components/dashboard/LineChartDashboard';
import PieChartDashboard from '../../components/dashboard/PieChartDashboard';
import { Btn } from '../../components/bottons/Button';
import ListIcon from '@mui/icons-material/List';
import BarChartIcon from '@mui/icons-material/BarChart';
import LineIngresoChartDashboard from '../../components/dashboard/LineIngresoChartDashboard';

const lineData = [
    {
        "id": "germany",
        "color": "hsl(297, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 138
            },
            {
                "x": "helicopter",
                "y": 35
            },
            {
                "x": "boat",
                "y": 207
            },
            {
                "x": "train",
                "y": 36
            },
            {
                "x": "subway",
                "y": 83
            },
            {
                "x": "bus",
                "y": 105
            },
            {
                "x": "car",
                "y": 286
            },
            {
                "x": "moto",
                "y": 186
            },
            {
                "x": "bicycle",
                "y": 21
            },
            {
                "x": "horse",
                "y": 258
            },
            {
                "x": "skateboard",
                "y": 296
            },
            {
                "x": "others",
                "y": 36
            }
        ]
    },
    {
        "id": "norway",
        "color": "hsl(225, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 109
            },
            {
                "x": "helicopter",
                "y": 93
            },
            {
                "x": "boat",
                "y": 233
            },
            {
                "x": "train",
                "y": 89
            },
            {
                "x": "subway",
                "y": 189
            },
            {
                "x": "bus",
                "y": 222
            },
            {
                "x": "car",
                "y": 121
            },
            {
                "x": "moto",
                "y": 293
            },
            {
                "x": "bicycle",
                "y": 244
            },
            {
                "x": "horse",
                "y": 57
            },
            {
                "x": "skateboard",
                "y": 19
            },
            {
                "x": "others",
                "y": 245
            }
        ]
    }
]

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
        "country": "AD",
        "hot dog": 167,
        "hot dogColor": "hsl(224, 70%, 50%)",
        "burger": 142,
        "burgerColor": "hsl(104, 70%, 50%)",
        "sandwich": 140,
        "sandwichColor": "hsl(261, 70%, 50%)",
        "kebab": 40,
        "kebabColor": "hsl(296, 70%, 50%)",
        "fries": 1,
        "friesColor": "hsl(314, 70%, 50%)",
        "donut": 160,
        "donutColor": "hsl(56, 70%, 50%)"
    },
    {
        "country": "AE",
        "hot dog": 13,
        "hot dogColor": "hsl(176, 70%, 50%)",
        "burger": 99,
        "burgerColor": "hsl(312, 70%, 50%)",
        "sandwich": 87,
        "sandwichColor": "hsl(28, 70%, 50%)",
        "kebab": 45,
        "kebabColor": "hsl(282, 70%, 50%)",
        "fries": 44,
        "friesColor": "hsl(296, 70%, 50%)",
        "donut": 172,
        "donutColor": "hsl(357, 70%, 50%)"
    },
]

const MainDashboard = () => (
    <CartaPrincipal hasCard={false}>
        <div className='align-self-start'>
            <h1>Dashboard</h1>
            <h2>Septiembre 2024</h2>
        </div>
        <div className='MainDashboard'>
            <div className='d-flex flex-column gap-4'>
                <div className='seccionDash'>
                    <h3>Porcentaje de Clientes en Mora</h3>
                    <div style={{ height: '330px', width: '550px' }}>
                        <PieChartDashboard data={pieData} />
                    </div>
                    <i className='p-0 m-0'>Click en un segmento para ver los clientes.</i>
                </div>
                <div className='seccionDash'>
                    <h3>Enlaces</h3>
                    <Btn type="primary" className='mt-3 align-self-start' icon={<ListIcon />} onClick={() => { alert("En progreso") }}>
                        Ver Cajas
                    </Btn>
                    <Btn type="primary" className='mt-3 align-self-start' icon={<BarChartIcon />} onClick={() => { alert("En progreso") }}>
                        Ver Ingresos
                    </Btn>
                </div>
            </div>

            <div className='d-flex flex-column gap-4'>
                <div className='seccionDash'>
                    <h3>Productos mas Vendidos</h3>
                    <div style={{ height: '330px', width: '570px' }}>
                        <LineChartDashboard data={data} />
                    </div>
                </div>
                <div className='seccionDash'>

                    <h3>Ingresos de Movimientos</h3>
                    <div style={{ height: '330px', width: '550px' }}>
                        <LineIngresoChartDashboard data={lineData} />
                    </div>
                </div>
            </div>

        </div>
    </CartaPrincipal>
);

export default MainDashboard;