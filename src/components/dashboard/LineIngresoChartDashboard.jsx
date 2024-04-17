import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line'
import useReporteMovimientos from '../../hooks/useReporteMovimientos';
import { dateIsLaterThan, formatDate, formattedToDate, getCurrentDate, getDateMinusMonths, getLastWeekDate } from '../../utils/DateStatics';
import { Btn } from '../bottons/Button';
import { precioHandler } from '../../utils/precioHandler';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import './dashboardComps.css'
import BasicDatePicker from '../DatePicker/BasicDatePicker';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import toast from 'react-hot-toast';

const LineIngresoChartDashboard = () => {

    const { getIngresoTotalPorFecha, isLoading: isLoadingIngresos, error404: errorNoIngresos } = useReporteMovimientos();

    //UNUSED ATM, TODO: USAR GRAFICO
    //const [data, setData] = useState([])
    //const [dateRange, setDateRange] = useState({ fechaInicio: getDateMinusMonths(3), fechaFin: getCurrentDate() })

    const [ingresoTotal, setIngresoTotal] = useState(0)

    const [startDate, setStartDate] = useState(getDateMinusMonths(2))
    const [endDate, setEndDate] = useState(getCurrentDate())

    const fetchIngresos = async () => {
        if (startDate === '' || endDate === '') return;
        if (dateIsLaterThan(startDate, endDate)) {
            toast.error('La fecha de inicio no puede ser mayor a la fecha de fin')
            return
        }
        const res = await getIngresoTotalPorFecha(startDate, endDate)
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
        fetchIngresos()
    }, [])

    const switchRenderer = () => {
        if (isLoadingIngresos) {
            return <Skeleton style={{ width: 150, height: 28 }} />
        } else if (errorNoIngresos) {
            return <h4>No hay ingresos en el rango seleccionado</h4>
        } else {
            return (
                <h4 className='m-0 p-0'>
                    {ingresoTotal < 0 ? '' : '+'}
                    {precioHandler(ingresoTotal)} Gs.
                </h4>
            )
        }
    }

    return (
        <>
            <div className='d-flex align-items-center justify-content-center gap-3'>
                <p className='m-0 p-0'>De: </p>
                <BasicDatePicker portalId="my-popper" selected={formattedToDate(startDate)} onChange={(date) => setStartDate(formatDate(date))} maxDate={new Date()} id="input-datepicker-ingresos-from" />
                <p className='m-0 p-0'>Hasta: </p>
                <BasicDatePicker portalId="my-popper" selected={formattedToDate(endDate)} onChange={(date) => setEndDate(formatDate(date))} maxDate={new Date()} id="input-datepicker-ingresos-to" />
                <Btn outline onClick={() => fetchIngresos()} id="btn-filtrar-ingresos" >
                    <FilterAltIcon />
                </Btn>
            </div>
            {/*No mostrar grafico por el momento, solo un div con el ingreso total*/}
            <div className='p-3 text-center gananciasDiv' id='ganancias-color-div'>
                {switchRenderer()}
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