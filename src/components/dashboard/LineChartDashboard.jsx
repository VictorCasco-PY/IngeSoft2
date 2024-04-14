import { ResponsiveBar } from '@nivo/bar';
import React, { forwardRef, useEffect, useState } from 'react';
import ReporteStorage from '../../utils/ReportesStorage';
import { useDashboard } from '../../context/DashboardContext';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Btn } from '../bottons/Button';
import { formatDate, getCurrentDate, getLastWeekDate } from '../../utils/DateStatics';
import { CircularProgress } from '@mui/material';
import BasicDatePicker from '../DatePicker.jsx/BasicDatePicker';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import SkeletonWrapper from '../loadingSkeleton/SkeletonWrapper';

/*
FORMATO para los datos:
[
    {
        "mes": "Julio",
        "Producto1": 10,
        (OPCIONAL) "Producto1Color": "hsl(0, 70%, 50%)",
        "Producto2": 20,
        (OPCIONAL) "Producto2Color": "hsl(0, 70%, 50%)",
        "Producto3": 30
        (OPCIONAL) "Producto3Color": "hsl(0, 70%, 50%)",
    },
    {
        "mes": "Agosto",
        "Producto1": 10,
        "Producto2": 20,
        "Producto3": 30
    }
]
*/

const LineChartDashboard = () => {

    const { getProductosMasVendidos, isLoadingProductosMasVendidos } = useDashboard();
    const [productosMasVendidos, setProductosMasVendidos] = useState(null);
    const [producotsLabels, setProductosLabels] = useState(null); //nombres en string de los productos como un arreglo

    const [productoMasVendido, setProductoMasVendido] = useState(null); //un producto singular el cual es el mas vendido

    const setDataFromKeys = (data) => {
        const months = ['Productos'] //hardcoded, TODO: filtrar por fechas
        let newData = [];

        //por cada mes se hace el bucle, añadiendo los productos y su cantidad
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

    //llamar a esta funcion cuando se quieran cambiar los datos en el grafico
    const ordenarDatos = async (fechaInicio, fechaFin) => {
        //asumiendo que las fechas de los states ya estan formateados, importante, formato: yyyy-mm-dd
        let data = await getProductosMasVendidos(fechaInicio, fechaFin)

        setProductosMasVendidos(setDataFromKeys(data))
        const labels = data.map(producto => producto.nombreProducto)
        setProductosLabels(labels)

        //tambien obtener el producto que fue mas vendido
        if (data.length > 0) {
            const productoMasVendido = data.reduce((prev, current) => (prev.cantidadVendida > current.cantidadVendida) ? prev : current)
            setProductoMasVendido(productoMasVendido.nombreProducto)
        }
    }

    //estos states por el momento solo se usan para el display en pantalla, no funcionan bien si los utilizo directamente en la funcion de ordenarDatos
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        let fechaInicio;
        let fechaFin;
        if (ReporteStorage.getFechaProductosMasVendidosData()) {
            const fechas = ReporteStorage.getFechaProductosMasVendidosData();
            fechaInicio = fechas.fechaInicio
            fechaFin = fechas.fechaFin
        } else { //si no hay fechas guardadas, se traen los producots desde hace una semana
            fechaFin = getCurrentDate();
            fechaInicio = getLastWeekDate();
        }
        ordenarDatos(fechaInicio, fechaFin)
        //popular date picker
        setStartDate(fechaInicio)
        setEndDate(fechaFin)
    }, [isLoadingProductosMasVendidos])

    return (
        <>
            <div className='d-flex align-items-center justify-content-center gap-3'>
                <p className='m-0 p-0'>De: </p>
                <BasicDatePicker selected={startDate} onChange={(date) => setStartDate(formatDate(date))} />
                <p className='m-0 p-0'>Hasta: </p>
                <BasicDatePicker selected={endDate} onChange={(date) => setEndDate(formatDate(date))} />
                <Btn outline onClick={() => ordenarDatos(startDate, endDate)} >
                    <FilterAltIcon />
                </Btn>
            </div>
            <div className='graphSection'>
                {isLoadingProductosMasVendidos ? (<SkeletonWrapper width={475}><Skeleton style={{ height: 280 }} /></SkeletonWrapper>) : (<ResponsiveBar
                    data={productosMasVendidos}
                    keys={producotsLabels}
                    indexBy="mes"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    groupMode="grouped"
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={{ scheme: 'category10' }}
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
                        legend: `${startDate ? `${startDate} hasta ${endDate}` : 'Productos mas vendidos'}`,
                        legendPosition: 'middle',
                        legendOffset: 38,
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
                />)}
            </div>
            {isLoadingProductosMasVendidos ? (<Skeleton style={{ width: 280 }} />)
                :
                (productoMasVendido && (<i className='p-0 m-0'>Producto mas vendido: {productoMasVendido}.</i>))
            }
        </>
    );
};

export default LineChartDashboard;

//${ReporteStorage.getFechaProductosMasVendidosData() ? `${ReporteStorage.getFechaProductosMasVendidosData().fechaInicio} hasta ${ReporteStorage.getFechaProductosMasVendidosData().fechaFin}` : 'Productos mas vendidos'}