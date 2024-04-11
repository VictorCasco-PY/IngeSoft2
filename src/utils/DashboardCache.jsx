import { cache } from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({ data }) {
    const report = getMetrics(data);
}