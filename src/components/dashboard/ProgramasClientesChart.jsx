import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import SkeletonWrapper from '../loadingSkeleton/SkeletonWrapper';
import useProgramasEntrenador from '../../hooks/useProgramasEntrenador';

const ProgramasClientesChart = ({ entrenadorId }) => {
    const { programas, loading } = useProgramasEntrenador(entrenadorId);

    const datosFormateados = programas.map(programa => ({
        titulo: programa.titulo,
        'Cantidad de clientes': programa.cantClientes
    }));

    const maxClientes = Math.max(...programas.map(programa => programa.cantClientes), 0);

    const tickValues = Array.from({ length: maxClientes + 1 }, (_, i) => i);

    return (
        <>
            <h3 style={{ color: '#333', textAlign: 'center', marginBottom: '20px' }}>Programas del Entrenador</h3>
            {loading ? (
                <SkeletonWrapper width={300} height={400}>
                </SkeletonWrapper>
            ) : (
                <div style={{ height: '500px', borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                    <ResponsiveBar
                        data={datosFormateados}
                        keys={['Cantidad de clientes']}
                        indexBy="titulo"
                        margin={{ top: 50, right: 180, bottom: 50, left: 60 }}
                        padding={0.5}
                        groupMode="grouped"
                        colors={['#ADD8E6']}
                        axisBottom={{
                            tickRotation: 0,
                            tickPadding: 10,
                            legend: 'Programas',
                            legendPosition: 'middle',
                            legendOffset: 32,
                            tickTextColor: '#333' 
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Cantidad de Clientes',
                            legendPosition: 'middle',
                            legendOffset: -40,
                            tickValues: tickValues,
                            format: value => Number.isInteger(value) ? value : null,
                            tickTextColor: '#333' 
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }} 
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
                                ],
                               
                            }
                        ]}
                    />
                </div>
            )}
        </>
    );
};

export default ProgramasClientesChart;
