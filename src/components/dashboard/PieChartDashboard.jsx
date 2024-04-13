import { ResponsivePie } from '@nivo/pie';
import React, { useEffect, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import ReporteStorage from '../../utils/ReportesStorage';

/*
FORMATO para los datos:
[
    {
        "id": "Pagados",
        "label": "Pagados",
        "value": 1,
        (opcional)"color": "hsl(225, 70%, 50%)"
    },
    {
        "id": "Pendientes",
        "label": "Pendientes",
        "value": 0,
        (opcional)"color": "hsl(297, 70%, 50%)"
    }
*/

const PieChartDashboard = () => {

    const [data, setData] = useState([])

    const { getEstadoClientes, isLoadingNewClients } = useDashboard();

    const ordenarDatos = async () => {
        let data;
        if (!ReporteStorage.getEstadosClientesData()) {
            data = await getEstadoClientes()
        } else {
            data = ReporteStorage.getEstadosClientesData();
        }
        console.log(data)
        const pagados = data.cantidadClientesEnRegla
        const pendientes = data.cantidadClientesMorosos
        setData([
            {
                "id": "Pagados",
                "label": "Pagados",
                "value": pagados,
            },
            {
                "id": "Pendientes",
                "label": "Pendientes",
                "value": pendientes
            }
        ])
    }

    useEffect(() => {
        ordenarDatos();
    }, [])

    return (
        <ResponsivePie
            data={data}
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
                    alert('Mostrar lista clientes en mora')
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
    );
};

export default PieChartDashboard;