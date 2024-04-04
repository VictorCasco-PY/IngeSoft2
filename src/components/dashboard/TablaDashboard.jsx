import React from 'react';
import { Table } from '../table/Table';

const TablaDashboard = ({data}) => {
    return (
        <Table headers={['Producto', 'Cantidad']} striped={true} textcenter={true}>
            {data.map((item, index) => (
                <tr key={index}>
                    <td>{item.producto}</td>
                    <td>{item['hot dog']}</td>
                </tr>
            ))}
        </Table>
    );
}

export default TablaDashboard;