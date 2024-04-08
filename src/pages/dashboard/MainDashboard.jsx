import React, { useState } from 'react';
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
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';


//estos son los datos de prueba para este ticket, se deben borrar en la implementacion
//todos estos datos seran guardados localmente en el componente, no se necesitara hacer llamadas a la api
const actividadDataOne = [
    {
        "mes": "Junio",
        "Powerlifting": 167,
        "PowerliftingColor": "hsl(224, 70%, 50%)",
        "Pilates": 160,
        "PilatesColor": "hsl(56, 70%, 50%)",
        "Yoga": 142,
        "YogaColor": "hsl(104, 70%, 50%)",
    },
]

const actividadesLabel = [
    'Powerlifting',
    'Pilates',
    'Yoga'
]

const lineDataOne = [
    {
        "id": "Ingresos",
        "color": "hsl(297, 70%, 50%)",
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
        "color": "hsl(225, 70%, 50%)",
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
        "color": "hsl(297, 70%, 50%)",
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
        "color": "hsl(225, 70%, 50%)",
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

const pieDataOne =
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
            "value": 200,
            "color": "hsl(273, 70%, 50%)"
        }
    ]

const pieDataTwo =
    [
        {
            "id": "Pagados",
            "label": "En Regla",
            "value": 489,
            "color": "hsl(48, 70%, 50%)"
        },
        {
            "id": "Pendientes",
            "label": "Morosos",
            "value": 56,
            "color": "hsl(273, 70%, 50%)"
        }
    ]

const productDataOne = [
    {
        "mes": "Junio",
        "Bebida Energetica": 167,
        "Bebida EnergeticaColor": "hsl(224, 70%, 50%)",
        "Agua": 160,
        "AguaColor": "hsl(56, 70%, 50%)",
        "Barra Energetica": 142,
        "Barra EnergeticaColor": "hsl(104, 70%, 50%)",
        "sandwich": 140,
        "sandwichColor": "hsl(261, 70%, 50%)",
        "kebab": 40,
        "kebabColor": "hsl(296, 70%, 50%)",
        "Food": 12,
        "FoodColor": "hsl(314, 70%, 50%)",
    },
]

const productDataTwo = [
    {
        "mes": "Junio",
        "Bebida Energetica": 167,
        "Bebida EnergeticaColor": "hsl(224, 70%, 50%)",
        "Agua": 160,
        "AguaColor": "hsl(56, 70%, 50%)",
        "Barra Energetica": 142,
        "Barra EnergeticaColor": "hsl(104, 70%, 50%)",
        "sandwich": 140,
        "sandwichColor": "hsl(261, 70%, 50%)",
        "kebab": 40,
        "kebabColor": "hsl(296, 70%, 50%)",
        "Food": 12,
        "FoodColor": "hsl(314, 70%, 50%)",
    },
    {
        "mes": "Julio",
        "Bebida Energetica": 122,
        "Bebida EnergeticaColor": "hsl(224, 70%, 50%)",
        "Agua": 54,
        "AguaColor": "hsl(56, 70%, 50%)",
        "Barra Energetica": 92,
        "Barra EnergeticaColor": "hsl(104, 70%, 50%)",
        "sandwich": 167,
        "sandwichColor": "hsl(261, 70%, 50%)",
        "kebab": 23,
        "kebabColor": "hsl(296, 70%, 50%)",
        "Food": 19,
        "FoodColor": "hsl(314, 70%, 50%)",
    },
]

const productosLabels = [
    'Bebida Energetica',
    'Agua',
    'Barra Energetica',
    'sandwich',
    'kebab',
    'Food'
]

const MainDashboard = () => {
    const [currentMaximized, setCurrentMaximized] = useState(null) //referencia al elemento maximizado
    const [productDisplayingData, setProductDisplayingData] = useState(productDataOne)
    const [ingresosDisplayingData, setIngresosDisplayingData] = useState(lineDataOne)
    const [morososDisplayingData, setMorososDisplayingData] = useState(pieDataOne)

    //Estos estados son solo para test, se deben borrar en la implementacion
    const [filterTestBool, setFilterTestBool] = useState(false)
    const [filterTestBoolIngresos, setFilterTestBoolIngresos] = useState(false)
    const [filterTestBoolMorosos, setFilterTestBoolMorosos] = useState(false)

    //Estas funciones se borraran en la implementacion, solo de prueba
    const filterProducts = () => {
        if (filterTestBool) {
            setProductDisplayingData(productDataOne)
            setFilterTestBool(false)
        } else {
            setProductDisplayingData(productDataTwo)
            setFilterTestBool(true)
        }
    }

    const filterIngresos = () => {
        if (filterTestBoolIngresos) {
            setIngresosDisplayingData(lineDataOne)
            setFilterTestBoolIngresos(false)
        } else {
            setIngresosDisplayingData(lineDataTwo)
            setFilterTestBoolIngresos(true)
        }
    }

    const filterMorosos = () => {
        if (filterTestBoolMorosos) {
            setMorososDisplayingData(pieDataOne)
            setFilterTestBoolMorosos(false)
        } else {
            setMorososDisplayingData(pieDataTwo)
            setFilterTestBoolMorosos(true)
        }
    } 
    /**/

    const handleBlurClick = () => {
        //TODO: esta solucion es fea por el momento, si es del tipo elemento
        if (!currentMaximized) return;
        if (typeof(currentMaximized) === "object" && currentMaximized.classList.contains("maximizedSeccion")) { 
            currentMaximized.classList.remove("maximizedSeccion")
            currentMaximized.classList.add("seccionDashHover")
            setCurrentMaximized(null)
        }
    }

    return (
        <>
            <div id="blur-screen-dashboard" className={currentMaximized ? 'blurScreen actBlur' : 'blurScreen'} onClick={handleBlurClick}></div>
            <DashCarta>
                <div className='DashboardHeader'>
                    <h1>Dashboard</h1>
                    <h2>Septiembre 2024</h2>
                </div>
                <div className='MDGrid position-relative'>
                    <SeccionDashboard id="seccion-clientes" header="Porcentaje de Clientes en Mora" maximizable={true} maximizedElement={currentMaximized} setMaximizedElement={setCurrentMaximized}>
                        {/*Este filtrado debe ser un select con los meses o un slider o algo por el estilo*/}
                        <div className='d-flex align-items-center justify-content-end gap-3' >
                            <p className='m-0'>
                                {filterTestBoolMorosos ? "Junio 2024" : "Julio 2024"}
                            </p>
                            <Btn id="btn-filtrar-morosos" type="primary" className='mt-3 align-self-start' icon={<FilterAltIcon />} onClick={() => { filterMorosos() }}>
                                Filtrar
                            </Btn>
                        </div>
                        <div className='graphSection'>
                            <PieChartDashboard data={morososDisplayingData} />
                        </div>
                        <i className='p-0 m-0'>Click en un segmento para ver los clientes.</i>
                    </SeccionDashboard>

                    <div className='d-flex flex-column gap-4'>
                        <SeccionDashboard header="Nuevos clientes este mes:">
                            <div className='d-flex flex-column gap-3'>
                                <div className='d-flex gap-3'>
                                    <ArrowCircleUpIcon className='arrowIndicator aGreen' />
                                    <nav style={{ fontSize: '2rem' }} className='notSelect'>+12</nav>
                                </div>
                                <h3 className='m-0 p-0'>Mes pasado:</h3>
                                <div className='d-flex gap-3'>
                                    <ArrowCircleDownIcon className='arrowIndicator aRed' />
                                    <nav style={{ fontSize: '2rem' }} className='notSelect'>-6</nav>
                                </div>
                            </div>
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
                        {/*Este filtrado debe ser un un slider con los meses*/}
                        <div className='align-self-end'>
                            <Btn type="primary" className='mt-3 align-self-start' icon={<FilterAltIcon />} onClick={() => {  }}>
                                Filtrar
                            </Btn>
                        </div>
                        <div className='graphSection'>
                            <LineChartDashboard data={actividadDataOne} keys={actividadesLabel} />
                        </div>
                        <i className='p-0 m-0'>Actividad con mas inscritos: Powerlifting.</i>
                    </SeccionDashboard>

                    <SeccionDashboard id="seccion-productos" header="Productos mas Vendidos" maximizable={true} maximizedElement={currentMaximized} setMaximizedElement={setCurrentMaximized}>
                        {/*Este filtrado debe ser un un slider con los meses*/}
                        <div className='align-self-end'>
                            <Btn type="primary" className='mt-3 align-self-start' icon={<FilterAltIcon />} onClick={() => { filterProducts() }}>
                                Filtrar
                            </Btn>
                        </div>
                        <div className='graphSection'>
                            <LineChartDashboard data={productDisplayingData} keys={productosLabels} />
                        </div>
                        <i className='p-0 m-0'>Producto mas vendido: Bebida Energetica.</i>
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