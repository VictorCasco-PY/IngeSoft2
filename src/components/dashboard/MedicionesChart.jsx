import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import SkeletonWrapper from '../loadingSkeleton/SkeletonWrapper';
import useMedicionesCliente from '../../hooks/useMedicionesCliente';

const MedicionesChart = ({ }) => {
    const { mediciones, loading } = useMedicionesCliente();

    const datosFormateados = mediciones.map(medicion => ({
        fecha: medicion.fecha,
        'Peso kg': medicion.peso,
        'Brazo cm': medicion.cirBrazo,
        'Cintura cm': medicion.cirCintura
    }));

    return (
        <>
            <h3 style={{ color: '#333', textAlign: 'center', marginBottom: '20px' }}>Mediciones del Cliente</h3>
            {loading ? (
                <SkeletonWrapper width={500} height={300}>
                </SkeletonWrapper>
            ) : (
                <div style={{ height: '300px', borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                    <ResponsiveBar
                        data={datosFormateados}
                        keys={['Peso kg', 'Brazo cm', 'Cintura cm']}
                        indexBy="fecha"
                        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                        padding={0.5}
                        groupMode="grouped"
                        colors={['#FFC0CB', '#FF1493', '#00CED1']} 
                        axisBottom={{
                            tickRotation: 0,
                            tickPadding: 10,
                            legendPosition: 'middle',
                            legendOffset: 32
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Valores kg/cm',
                            legendPosition: 'middle',
                            legendOffset: -40
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
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
                    />
                </div>
            )}
        </>
    );
};

export default MedicionesChart;
