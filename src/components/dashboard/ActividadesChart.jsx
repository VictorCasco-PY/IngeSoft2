import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import SkeletonWrapper from '../loadingSkeleton/SkeletonWrapper';

const data = [
    {
        "Yoga": 25,
        "Pilates": 30,
        "Powerlifting": 20,
    },
];

const keys = [
    "Yoga",
    "Pilates",
    "Powerlifting",
]

const ActividadesChart = () => (
    <>
        <div className='graphSection'>
            <ResponsiveBar
                data={data}
                keys={keys}
                indexBy="actividad"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                groupMode="grouped"
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                colors={{ scheme: 'category10' }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Actividades',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Clientes',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
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
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
        </div>
        {false ? (<Skeleton style={{ width: 280 }} />)
            :
            (true && (<i className='p-0 m-0'>Actividad mas suscrita: Pilates.</i>))
        }
    </>
);

export default ActividadesChart;