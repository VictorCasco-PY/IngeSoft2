import React from 'react';
import { Table } from '../table/Table';
import './dashboardComps.css'

const TablaDashboard = ({data}) => {

    const handleClick = (id) => {
        alert(id);
    }

    return (
        <Table headers={['°', 'Producto', 'Ventas']} striped={true}>
            {data.map((item, index) => (
                <tr key={index} onClick={() => {handleClick(index)}} className='rowClickable'>
                    <td>{index+1}</td>
                    <td>{item.producto}</td>
                    <td>{item['hot dog']}</td>
                </tr>
            ))}
        </Table>
    );
}

export default TablaDashboard;