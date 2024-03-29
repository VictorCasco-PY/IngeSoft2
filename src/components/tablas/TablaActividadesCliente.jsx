import React, { useEffect, useState } from 'react';
import useSuscripcion from '../../hooks/useSuscripcion';
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from 'react-router-dom';
import './TablaActividades.css';
import { capFirstMinRest, formatFecha } from '../../utils/Formatting';

const TablaActividadesCliente = ({ toast, clienteId }) => {

    const { getSuscripcionesByCliente, data: req_suscripciones, isLoading: cargandoSuscripciones, error: errorSuscripciones } = useSuscripcion();
    const [actividades, setActividades] = useState([]);
    const [loadTable, setLoadTable] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const suscripcionesData = await getSuscripcionesByCliente(1, 1);
                setActividades(suscripcionesData);
                setLoadTable(true);
            } catch (error) {
                if (toast) {
                    toast.error("Error al cargar suscripciones. Revise la conexión.");
                }
            }

            console.log(actividades['items'])
        };

        fetchData();
    }, []);

    return (
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Modalidad</th>
                    <th>Estado</th>
                    <th>Fecha de Inscripcion</th>
                    <th>Fecha de Vencimiento</th>
                </tr>
            </thead>
            <tbody>
                {(!loadTable) ? (
                    <tr>
                        <td colSpan="4">
                            <CircularProgress />
                        </td>
                    </tr>
                ) : (
                    actividades['items'].map((actividad) => (
                        <tr key={actividad.id}>
                            <td onClick={() => { navigate(`/infoServicio/${actividad.actividadId}`) }} className='rowClickable'>
                                {actividad.actividadNombre}
                            </td>
                            <td>{capFirstMinRest(actividad.modalidad)}</td>
                            <td>{capFirstMinRest(actividad.estado)}</td>
                            <td>{formatFecha(actividad.fechaInicio)}</td>
                            <td>{formatFecha(actividad.fechaFin)}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default TablaActividadesCliente;
