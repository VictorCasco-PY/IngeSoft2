import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line'
import useReporteMovimientos from '../../hooks/useReporteMovimientos';
import { getCurrentDate, getDateMinusMonths, getLastWeekDate } from '../../utils/DateStatics';
import { Btn } from '../bottons/Button';
import { precioHandler } from '../../utils/precioHandler';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import SkeletonWrapper from '../loadingSkeleton/SkeletonWrapper';
import './dashboardComps.css'

const DATE_RANGE = {
    '1 Mes': { fechaInicio: getLastWeekDate(), fechaFin: getCurrentDate() },
    '3 Meses': { fechaInicio: getDateMinusMonths(3), fechaFin: getCurrentDate() },
    '6 Meses': { fechaInicio: getDateMinusMonths(6), fechaFin: getCurrentDate() },
    '1 Año': { fechaInicio: getDateMinusMonths(12), fechaFin: getCurrentDate() }
}


const LineIngresoChartDashboard = () => {

    const { getIngresoTotalPorFecha, isLoading: isLoadingIngresos } = useReporteMovimientos();

    //UNUSED ATM, TODO: USAR GRAFICO
    //const [data, setData] = useState([])
    //const [dateRange, setDateRange] = useState({ fechaInicio: getDateMinusMonths(3), fechaFin: getCurrentDate() })

    const [ingresoTotal, setIngresoTotal] = useState(0)
    const [rangeSelected, setRangeSelected] = useState('1 Mes')

    const fetchIngresos = async (rangeObj) => {
        const { fechaInicio, fechaFin } = DATE_RANGE[rangeObj]
        //setDateRange({ fechaInicio, fechaFin })
        const res = await getIngresoTotalPorFecha(fechaInicio, fechaFin)
        setRangeSelected(rangeObj)
        setIngresoTotal(res.ingresoTotal)
        if (res.ingresoTotal < 0) {
            document.getElementById('ganancias-color-div').classList.add('aRed')
            document.getElementById('ganancias-color-div').classList.remove('aGreen')
        } else {
            document.getElementById('ganancias-color-div').classList.add('aGreen')
            document.getElementById('ganancias-color-div').classList.remove('aRed')
        }
    }

    /*
    FORMATO:
    [ { fecha: '2021-07-01', ganancia: 0 }, { fecha: '2021-08-01', ganancia: 0 }, { fecha: '2021-09-01', ganancia: 0 } ]
    */

    useEffect(() => {
        fetchIngresos('1 Mes')
    }, [])

    return (
        <>
            <div>
                <div className='d-flex justify-content-center pt-2 gap-1'>
                    <Btn outline onClick={() => { fetchIngresos('1 Mes') }} disabled={rangeSelected === '1 Mes'} id='btn-filtrar-ingresos-1mes'>
                        1 Mes
                    </Btn>
                    <Btn outline onClick={() => { fetchIngresos('3 Meses') }} disabled={rangeSelected === '3 Meses'} id='btn-filtrar-ingresos-3meses' >
                        3 Meses
                    </Btn>
                    <Btn outline onClick={() => { fetchIngresos('6 Meses') }} disabled={rangeSelected === '6 Meses'} id='btn-filtrar-ingresos-6meses' >
                        6 Meses
                    </Btn>
                    <Btn outline onClick={() => { fetchIngresos('1 Año') }} disabled={rangeSelected === '1 Año'} id='btn-filtrar-ingresos-1anho'>
                        1 Año
                    </Btn>
                </div>
            </div>
            {/*No mostrar grafico por el momento, solo un div con el ingreso total*/}
            <div className='p-3 text-center gananciasDiv' id='ganancias-color-div'>
                {isLoadingIngresos ?
                    <Skeleton style={{ width: 150, height: 28 }} />
                    :
                    ingresoTotal &&
                    <h4 className='m-0 p-0'>
                        {ingresoTotal < 0 ? '' : '+'}
                        {precioHandler(ingresoTotal)} Gs.
                    </h4>
                }
            </div>
            {/*<div>
                <Btn type="primary" className='mt-3 align-self-start' >
                    Filtrar
                </Btn>
            </div>
            <div className='graphSection'>
                <ResponsiveLine
                    data={data}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                        type: 'linear',
                        min: 'auto',
                        max: 'auto',
                        stacked: false,
                        reverse: false
                    }}
                    yFormat=" >-.2f"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Mes',
                        legendOffset: 36,
                        legendPosition: 'middle',
                        truncateTickAt: 0
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Monto (gs)',
                        legendOffset: -40,
                        legendPosition: 'middle',
                        truncateTickAt: 0
                    }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    minValue={0}
                    pointLabelYOffset={-12}
                    enableTouchCrosshair={true}
                    useMesh={true}
                    layers={['grid', 'markers', 'axes', 'areas', 'crosshair', 'lines', 'points', 'slices', 'legends']}
                    curve='linear'
                    enableGridX={true}
                    enableGridY={true}
                    enablePoints={true}
                    enablePointLabel={true}
                    pointLabel={(d) => d.y}
                    colors={({ id, color }) => { return color }}
                    enableArea={false}
                    areaOpacity={0.1}
                    areaBlendMode='normal'
                    areaBaselineValue={0}
                    lineWidth={2}
                    isInteractive={true}
                    debugMesh={false}
                    tooltip={({ point }) => {
                        return (
                            <div
                                style={{
                                    background: 'white',
                                    padding: '9px 12px',
                                    border: '1px solid #ccc',
                                }}
                            >
                                <strong>{point.data.xFormatted}</strong>
                                <br />
                                <strong>{point.data.serieId}</strong>
                                <br />
                                <strong>{point.data.yFormatted}</strong>
                            </div>
                        );
                    }}
                    enableSlices='x'
                    debugSlices={false}
                    sliceTooltip={({ slice }) => {
                        return (
                            <div
                                style={{
                                    background: 'white',
                                    padding: '9px 12px',
                                    border: '1px solid #ccc',
                                }}
                            >
                                <strong>{slice.points[0].data.xFormatted}</strong>
                                <br />
                                <strong>{slice.points[0].data.serieId}</strong>
                                <br />
                                <strong>{slice.points[0].data.yFormatted}</strong>
                            </div>
                        );
                    }}
                    enableCrosshair={true}
                    crosshairType='bottom'
                    role='img'
                    defs={[]}
                    fill={[]}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </div>*/}

        </>
    );
};

export default LineIngresoChartDashboard;