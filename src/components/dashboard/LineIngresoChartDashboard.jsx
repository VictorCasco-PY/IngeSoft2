import React, { useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line'
import useReporteMovimientos from '../../hooks/useReporteMovimientos';

const LineIngresoChartDashboard = ({data}) => {

    const { getIngresoTotalPorFecha, isLoading: isLoadingIngresos } = useReporteMovimientos();

    useEffect(() => {
        const fetchIngresos = async () => {
            await getIngresoTotalPorFecha();
        }
        fetchIngresos();
    },[])

    return (
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
            colors={{ scheme: 'category10' }}
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
                );}}
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
    );
};

export default LineIngresoChartDashboard;