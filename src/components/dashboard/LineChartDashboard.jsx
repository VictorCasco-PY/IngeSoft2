import { ResponsiveBar } from '@nivo/bar';
import React, { useEffect, useState } from 'react';
import ReporteStorage from '../../utils/ReportesStorage';
import { useDashboard } from '../../context/DashboardContext';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Btn } from '../bottons/Button';


const LineChartDashboard = () => {

    const { isDataStored, getProductosMasVendidos, isLoadingProductosMasVendidos } = useDashboard();
    const [productosMasVendidos, setProductosMasVendidos] = useState(null);
    const [producotsLabels, setProductosLabels] = useState(null);

    const setDataFromKeys = (data) => {
        //each array should be a month
        const months = ['Julio'] //hardcoded, TODO: filtrar por fechas
        let newData = [];

        months.forEach(month => {
            let newProducto = {}
            newProducto['mes'] = month
            data.forEach(producto => {
                newProducto[producto.nombreProducto] = producto.cantidadVendida
            })
            newData.push(newProducto)
        })
        return newData
    }

    const ordenarDatos = async () => {
        let data;
        data = await getProductosMasVendidos()

        setProductosMasVendidos(setDataFromKeys(data))
        const labels = data.map(producto => producto.nombreProducto)
        setProductosLabels(labels)
    }

    useEffect(() => {
        ordenarDatos()
    }, [isLoadingProductosMasVendidos])

    return (
        <>
            <div className='align-self-end'>
                <Btn type="primary" className='mt-3 align-self-start' icon={<FilterAltIcon />}>
                    Filtrar
                </Btn>
            </div>
            <div className='graphSection'>
                <ResponsiveBar
                    data={productosMasVendidos}
                    keys={producotsLabels}
                    indexBy="mes"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    groupMode="grouped"
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={{ scheme: 'nivo' }}
                    defs={[
                        {
                            id: 'dots',
                            type: 'patternDots',
                            background: 'inherit',
                            color: '#38bcb2',
                            size: 4,
                            padding: 1,
                            stagger: true
                        },
                        {
                            id: 'lines',
                            type: 'patternLines',
                            background: 'inherit',
                            color: '#eed312',
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10
                        }
                    ]}
                    fill={[]}
                    borderColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                1.6
                            ]
                        ]
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Mes',
                        legendPosition: 'middle',
                        legendOffset: 32,
                        truncateTickAt: 0
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Ventas (cantidad)',
                        legendPosition: 'middle',
                        legendOffset: -40,
                        truncateTickAt: 0
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                1.6
                            ]
                        ]
                    }}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 20,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    role="application"
                    ariaLabel="Nivo bar chart demo"
                    barAriaLabel={e => e.id + ": " + e.formattedValue + " in mes: " + e.indexValue}
                />
            </div>
            <i className='p-0 m-0'>Producto mas vendido: Bebida Energetica.</i>
        </>
    );
};

export default LineChartDashboard;