import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie'
import CartaPrincipal from '../../components/cartaPrincipal/CartaPrincipal';

import './MainDashboard.css'

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
    <CartaPrincipal>
        <h1>Dashboard</h1>
        <h2>Septiembre 2024</h2>
        <div className='d-flex justify-content-between'>
            <div className='seccionDash'>
                <p>Porcentaje de Clientes en Mora</p>
                <div style={{ height: '350px', width: '550px' }}>
                    <ResponsivePie
                        data={pieData}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        activeOuterRadiusOffset={8}
                        borderWidth={1}
                        borderColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    0.2
                                ]
                            ]
                        }}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#333333"
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: 'color' }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    2
                                ]
                            ]
                        }}
                        onClick={(data) => {
                            if (data.id === 'Pendientes') {
                                alert('Clientes en mora: 112')
                            }
                        }}
                        defs={[
                            {
                                id: 'dots',
                                type: 'patternDots',
                                background: 'inherit',
                                color: 'rgba(255, 255, 255, 0.3)',
                                size: 4,
                                padding: 1,
                                stagger: true
                            },
                            {
                                id: 'lines',
                                type: 'patternLines',
                                background: 'inherit',
                                color: 'rgba(255, 255, 255, 0.3)',
                                rotation: -45,
                                lineWidth: 6,
                                spacing: 10
                            }
                        ]}
                        fill={[
                            {
                                match: {
                                    id: 'Pendientes'
                                },
                                id: 'lines'
                            },
                            {
                                match: {
                                    id: 'Pagados'
                                },
                                id: 'dots'
                            }
                        ]}
                        legends={[
                            {
                                anchor: 'bottom',
                                direction: 'row',
                                justify: false,
                                translateX: 0,
                                translateY: 56,
                                itemsSpacing: 0,
                                itemWidth: 100,
                                itemHeight: 18,
                                itemTextColor: '#999',
                                itemDirection: 'left-to-right',
                                itemOpacity: 1,
                                symbolSize: 18,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemTextColor: '#000'
                                        }
                                    }
                                ]
                            }
                        ]}
                    />
                </div>
            </div>
            <div className='seccionDash'>
                <p>Productos mas vendidos en este mes</p>
                <div style={{ height: '350px', width: '600px' }}>
                    <ResponsiveBar
                        data={data}
                        keys={['hot dog']}
                        indexBy="producto"
                        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                        padding={0.3}
                        valueScale={{ type: 'linear' }}
                        indexScale={{ type: 'band', round: true }}
                        colors={{ scheme: 'nivo' }}
                        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'producto',
                            legendPosition: 'middle',
                            legendOffset: 32
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'ventas',
                            legendPosition: 'middle',
                            legendOffset: -40
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                    />
                </div>
            </div>
        </div>
    </CartaPrincipal>
);

export default MainDashboard;